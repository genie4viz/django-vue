import React, {PropTypes} from "react";
import {Link} from "react-router";

import {RegisterForm} from "../form_components/registerForm.jsx";
import {FacebookLogin} from "../facebook.jsx";

import {SITE_PATH} from "../../config.jsx";

export const Register = ({loginSocial, registerUserByEmail}) => {
    return (
        <div className="login-register-page">
            <div className="login-register-page__form">
                <Link to={SITE_PATH}><img src={`/static/img/Logo_Hikster_Beta-01.png`} alt=""/></Link>
                <h1 className="login-register-page__title">Enregistez-vous!</h1>
                <p className="login-register-page__description">Hikster, c&#8217;est plus de 850 lieux de randonnées pédestres. Et bien plus pour les membres incrits!</p>
                <div className="login-register-page__facebook">
                    <FacebookLogin socialId={"899305460182064"} responseHandler={loginSocial}/>
                </div>
                <div className="ui horizontal divider">Ou</div>
                <RegisterForm registerUserByEmail={registerUserByEmail}/>
            </div>
        </div>
    )
}

Register.propTypes = {
    loginSocial: PropTypes.func.isRequired
}
