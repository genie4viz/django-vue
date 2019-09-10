import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"

import {Register} from "../Components/profile_components/register.jsx"

import {loginUserFacebook, registerUserByEmail} from "../Actions/login_actions.jsx"

const mapStateToProps = (state) => {
    return {
      authed: state.authed,
      user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginSocial: response => dispatch(loginUserFacebook(response)),
        registerUserByEmail: formData => dispatch(registerUserByEmail(formData))
    }
}

class RegisterContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        authed: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        loginSocial: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        return <Register {...this.props}/>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer)
