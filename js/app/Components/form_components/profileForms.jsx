import React, {Component, PropTypes} from "react"
import {Field, reduxForm} from "redux-form"

import {Address} from "./sections/address.jsx"

import {DropzoneField} from "./fields/dropzoneField.jsx"
import {renderContactFields} from "./fields/contactField.jsx"
import {InputField, TextAreaField} from "./fields/genericField.jsx"

import {validate} from "./validator/profileFormValidator.js"
import * as FieldValidators from "./validator/genericValidators.js"

import {fieldMap} from "./utils/fieldTranslationsMapping.js"
import {not} from "../../Utils/boolean.js"


export class ProfileForm extends Component {
  render() {
    return (
      <div className="edit-form ui form">
        <div className="edit-form__text">
          <Field name="id" component="input" type="hidden"/>
          <Field name="user" component="input" type="hidden"/>

          {/* Personal info */}
          <div className="two fields">
            <div className="grouped fields">
              <Field 
                name="email" 
                component={InputField}
                label={<label>Courriel</label>}
                required={true}
                />
              <Field 
                name="first_name" 
                component={InputField}
                label={<label>Prénom</label>}
                required={true}
                />
              <Field 
                name="last_name" 
                component={InputField}
                label={<label>Nom de famille</label>}
                required={true}
                />

              {/* Personal contact */}
              <Field
                name="phone_number.type"
                component={InputField}
                value="Téléphone"
                type="hidden"
                />
              <Field
                name="organisation_contact"
                component={InputField}
                label={<label>Numéro de téléphone</label>}
                placeholder="Exemple : XXX-XXX-XXXX"
                required
                validate={[FieldValidators.required]}
                />
              <Field
                name="organisation"
                component={InputField}
                label={<label>Organisation</label>}
                />
            </div>

            {/* Personal address */}
            <Address/>
          </div>

          {/* Personal info */}
          <div className="field">
            <label>Photo de profil</label>
            <Field name="profile_picture" component={DropzoneField}/>
          </div>

          {/*<Field 
            name="description" 
            rows="4" 
            component={TextAreaField} 
            placeholder="Dites-nous qui vous êtes..."
            label={<label>Courte description</label>}
            />*/}
        </div>
      </div>
    )
  }
}

export default ProfileForm = reduxForm({form: "profile-data-form", validate})(ProfileForm)
