import React, {Component, PropTypes} from "react"
import {reduxForm, Field} from "redux-form"
import classNames from "classnames"

import {validate} from "./validator/loginFormValidator.js"
import {InputField} from "./fields/genericField.jsx"
import {FormState} from "./states/formStates.js"

export class LoginForm extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        login: PropTypes.func.isRequired
    }

    render() {
        const {handleSubmit, login, submitting} = this.props

        let formState = FormState(submitting)

        return (
            <div className={formState}>
                <Field 
                    name="username" 
                    type="text" 
                    placeholder="Nom d'utilisateur" 
                    component={InputField}
                    />
                <Field 
                    name="password" 
                    type="password" 
                    placeholder="Mot de passe" 
                    component={InputField}
                    />
                <button className="fluid ui icon button" onClick={handleSubmit(login)}>Connexion</button>
            </div>
        )
    }
}

LoginForm = reduxForm({form: "login", validate})(LoginForm)
