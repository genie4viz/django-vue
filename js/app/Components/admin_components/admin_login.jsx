import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import { LoginForm } from '../form_components/loginForm.jsx'

import {SITE_PATH} from '../../config.jsx'

const AdminLogin = ({login}) => {
    return(
        <div className="login-register-page">
            <div className="login-register-page__form">
                <Link to={SITE_PATH}><img src={`/static/img/Logo_Hikster_Beta-01.png`} alt=""/></Link>
                <h1 className="login-register-page__title">Admin Hikster</h1>
                <LoginForm login={login}/>
            </div>
        </div>
    )
}

AdminLogin.propTypes = {
    login: PropTypes.func.isRequired,
}

export default AdminLogin