/**
 * Created by fbrousseau on 2016-03-14.
 */
import React, { PropTypes } from "react";

import {LoginForm, RegisterForm} from "../Components/form_components/forms.jsx";
import {FacebookLogin} from "../Components/facebook.jsx";

import { SITE_PATH } from "../config.jsx";

export const LoginModal = (props) => {
    return (
        <div className="md-modal md-effect-1" id="modal-login">
            <div className="md-content">
                <h3>Login</h3>
                <div>
                    <ul>
                        <li>
                            <FacebookLogin socialId={"899305460182064"} responseHandler={props.onLoginOrSignUpFacebook}/>
                        </li>
                    </ul>
                    <div className="strike">
                        <span>ou</span>
                    </div>
                    <ul>
                        <li>
                            <LoginForm onSubmit={ props.onLoginSubmit }/>
                        </li>
                    </ul>
                    <button className="md-close">
                        <img src={ "/static/img/SVG_Contours_gris_fonc/Fermer.svg" }/>
                    </button>
                </div>
            </div>
        </div>
    )
};

LoginModal.propTypes = {
    onLoginSubmit: PropTypes.func.isRequired
};

export const RegisterModal = (props) => {
    return (
        <div className="md-modal md-effect-1" id="modal-register">
            <div className="md-content">
                <h3>Register</h3>
                <div>
                    <ul>
                        <li>
                            <FacebookLogin socialId={"899305460182064"} responseHandler={props.onLoginOrSignUpFacebook}/>
                        </li>
                    </ul>
                    <div className="strike">
                        <span>ou</span>
                    </div>
                    <ul>
                        <li>
                            <RegisterForm onSubmit={ props.onRegisterSubmit }/>
                        </li>
                    </ul>
                    <button className="md-close">
                        <img src={ "/static/img/SVG_Contours_gris_fonc/Fermer.svg" }/>
                    </button>
                </div>
            </div>
        </div>
    )
};

RegisterModal.propTypes = {
    onRegisterSubmit: PropTypes.func.isRequired
};
