import React, {Component, PropTypes} from "react";

export class FacebookLogin extends Component {
    static propTypes = {
        responseHandler: PropTypes.func.isRequired,
        socialId: PropTypes.string.isRequired,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        scope: PropTypes.string,
        buttonText: PropTypes.string,
        fields: PropTypes.string,
        class: PropTypes.string,
        version: PropTypes.string,
        language: PropTypes.string
    };

    static defaultProps = {
        buttonText: "Facebook",
        scope: "public_profile, email",
        xfbml: false,
        cookie: false,
        fields: "name, email, first_name, last_name, picture",
        class: "kep-login-facebook",
        version: "v2.5",
        language: "en_CA"
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (function(d, s, id) {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "facebook-jssdk"));

        window.fbAsyncInit = () => {
            FB.init({appId: this.props.socialId, xfbml: this.props.xfbml, cookie: this.props.cookie, version: this.props.version});
        };
    }

    responseApi(authResponse) {
        FB.api("/me", {
            fields: this.props.fields
        }, (me) => {
            me.accessToken = authResponse.accessToken;
            this.props.responseHandler(me);
        });
    };

    checkLoginState(response) {
        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else {
            if (this.props.responseHandler) {
                this.props.responseHandler({status: response.status});
            }
        }
    };

    clickHandler() {
        FB.login(this.checkLoginState.bind(this), {scope: this.props.scope});
    };

    render() {
        return (
            <button className="fluid ui facebook button" onClick={this.clickHandler.bind(this)}>
                <i className="white facebook icon"></i>
                {this.props.buttonText}
            </button>
        );
    }
}
