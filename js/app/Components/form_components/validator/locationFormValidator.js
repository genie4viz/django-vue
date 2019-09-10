import moment from 'moment' // eslint-disable-line

import * as FORM_CONSTANTS from '../constants/constants.js'
import { not } from "../../../Utils/boolean.js"

export const validate = values => {
    let errors = {}

    if (not(values.name)) errors.name = FORM_CONSTANTS.REQUIRED

    if (!values.contact || !values.contact.length) {
      errors.contact = {_error: "*Veuillez entrer au moins un contact"}
    } else {
      const contactsArrayErrors = []

      values.contact.forEach( (contact, index) => {
        const contactError = {}

        if(!contact || !contact.type) {
          contactError.type = FORM_CONSTANTS.REQUIRED
          contactsArrayErrors[index] = contactError
        }

        if(!contact || !contact.value) {
          contactError.value = FORM_CONSTANTS.REQUIRED
          contactsArrayErrors[index] = contactError
        }

      })

      if(contactsArrayErrors.length) {
        errors.contact = contactsArrayErrors
      }

    }

    if (not(values.description)) errors.description = FORM_CONSTANTS.REQUIRED

    return errors
}
