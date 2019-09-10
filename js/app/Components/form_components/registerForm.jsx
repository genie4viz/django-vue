import React, {Component, PropTypes} from "react"
import {reduxForm, Field} from "redux-form"
import axios from "axios"
import ReCAPTCHA from "react-google-recaptcha"
import classNames from "classnames"

import {registerUserByEmail} from "../../Actions/login_actions.jsx"
import {validate} from "./validator/registerFormValidator.js"
import {InputField} from "./fields/genericField.jsx"

import {recaptchaKey} from "../../config.jsx"

export class RegisterForm extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    constructor(props) {
      super(props)
      this.state = {
        isRecaptchaValid: false
      }
    }

    onChange(value) {
      this.setState({isRecaptchaValid: true})
    }

    render() {
        const {handleSubmit, registerUserByEmail} = this.props
        const {isRecaptchaValid} = this.state

        let disabled = classNames({
          "fluid ui icon button": isRecaptchaValid,
          "fluid ui icon disabled button" : !isRecaptchaValid
        })

        return (
            <div className="ui form error">
                <Field name="email" type="text" placeholder="Courriel" component={InputField}/>
                <Field name="last_name" type="text" placeholder="Nom" component={InputField}/>
                <Field name="first_name" type="text" placeholder="Prénom" component={InputField}/>
                <Field name="password1" type="password" placeholder="Mot de passe" component={InputField}/>
                <Field name="password2" type="password" placeholder="Confirmez mot de passe" component={InputField}/>
                <div className="register-page__recaptcha">
                    <ReCAPTCHA
                      ref="recaptcha"
                      sitekey={recaptchaKey}
                      onChange={this.onChange.bind(this)}
                    />
                </div>
                <button className={disabled} onClick={handleSubmit(registerUserByEmail)}>Enregistrer</button>
            </div>
        )
    }
}

RegisterForm = reduxForm({form: "register", validate})(RegisterForm)
