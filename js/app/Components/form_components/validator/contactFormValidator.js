import * as CONSTANTS from '../constants/constants'
import { not } from "../../../Utils/boolean.js"

var phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance()

const behaviours = {
    [CONSTANTS.CONTACT_TYPE.EMAIL](contact, errors) {
        if (contact.type === "Courriel" && not(CONSTANTS.EMAIL.test(contact.value))) {
            errors['value'] = "Veuillez entrer une adresse courriel valide."
        } else {
            errors['type'] = "Veuillez choisir le type courriel."
        }
        return errors
    },
    [CONSTANTS.CONTACT_TYPE.WEBSITE](contact, errors) {
        if (contact.type === "Site Internet" && not(CONSTANTS.WEBSITE.test(contact.value))) {
            errors['value'] = "Veuillez entrer une adresse valide."
        } else {
            errors['type'] = "Veuillez choisir le type site internet."
        }
        return errors
    },
}

export const validateContact = contact => {
    let errors = {}

    if (not(contact) || not(contact.value)) {
        errors = CONSTANTS.REQUIRED
    } else {
        const behaviour = behaviours[contact.type]
        if (behaviour) errors = behaviour(contact, errors)
    }
    return errors
}