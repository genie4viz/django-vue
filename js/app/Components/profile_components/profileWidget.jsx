/**
 * Created by fbrousseau on 2016-03-23.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router'
import ui from 'redux-ui'
import classNames from 'classnames'
import {isEmpty as _Empty} from 'lodash/fp'

import {FacebookLogin} from '../facebook.jsx'
import {LoginForm} from '../form_components/loginForm.jsx'

import {loginUserFacebook, loginUserByEmail, logout} from '../../Actions/login_actions.jsx'

const profileWidgetUiState = {
    key: "profile-profile-widget",
    state: {
        isProfileMenuOpen: false
    }
}

export const ProfileLoggedIn = ({user, logout, toggleMenu, ui}) => {
    let img
    let name = _Empty(user.profile)
        ? "Profil"
        : user.profile.first_name

    let hidden = classNames({
        "popup--hidden": !ui.isProfileMenuOpen
    })

    if (_Empty(user.profile) || !user.profile.profile_picture) {
        img = <img className="ui avatar image" src="/static/img/test/johnny.jpg" alt="Hikster Anonymous Profile"/>
    } else if (user.profile.profile_picture) {
        img = <img className="ui avatar image" src={user.profile.profile_picture.replace("jpeg", "svg+xml")} alt=""/>
    }

    return (
        <div className="profile-widget">
            {img}
            <span>Bonjour, {name}.<a onClick={logout}> Déconnexion</a></span>
        </div>
    )
}

ProfileLoggedIn.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}

export const ProfileLoggedOut = ({login, loginSocial, toggleMenu, ui}) => {
    let hidden = classNames({
        "popup--hidden": !ui.isProfileMenuOpen
    })

    return (
        <div className="profile-widget">
            <div className="profile-widget__avatar">
                <a onClick={toggleMenu}>
                    <span>Connexion &nbsp;</span>
                    <img className="ui avatar image profile-widget__img--default" src="/static/img/icons/2_colors/Icons_Hikster_2_colors-73.svg" alt="Hikster Anonymous Profile"/>
                </a>
            </div>
            <div className={`profile-widget__menu profile-widget__menu--loggedout popup popup--right ${hidden}`}>
                <div className="profile-widget__facebook">
                    <FacebookLogin socialId={"899305460182064"} responseHandler={loginSocial}/>
                </div>
                <div className="ui horizontal divider">Ou</div>
                <div className="profile-widget__basic-login">
                    <LoginForm login={login}/>
                </div>
                <div className="profile-widget__subscribe">
                    <p>Pas encore inscrit? Faites-le<Link to={"/register/"}>&nbsp;ici</Link>!</p>
                </div>
            </div>
        </div>
    )
}

ProfileLoggedOut.propTypes = {
    login: PropTypes.func.isRequired,
    loginSocial: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
      authed: state.authed,
      user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (formData) => dispatch(loginUserByEmail(formData)),
        loginSocial: (response) => dispatch(loginUserFacebook(response)),
        logout: () => dispatch(logout())
    }
}

export class ProfileWidget extends Component {
    static propTypes = {
        authed: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        ui: PropTypes.object.isRequired,
        updateUI: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        const {updateUI} = this.props
        if (this.props.authed.accessToken !== nextProps.authed.accessToken) {
            updateUI({isProfileMenuOpen: false})
        }
    }

    toggleMenu() {
        const {ui, updateUI} = this.props
        ui.isProfileMenuOpen
            ? updateUI({isProfileMenuOpen: false})
            : updateUI({isProfileMenuOpen: true})
    }

    render() {
        const {authed} = this.props

        return (authed.accessToken
            ? <ProfileLoggedIn toggleMenu={this.toggleMenu.bind(this)} {...this.props}/>
            : <ProfileLoggedOut toggleMenu={this.toggleMenu.bind(this)} {...this.props}/>)
    }
}

ProfileWidget = ui(profileWidgetUiState)(ProfileWidget)

export default connect(mapStateToProps, mapDispatchToProps)(ProfileWidget)
