import * as FORM_CONSTANTS from '../constants/constants.js'
import {not} from "../../../Utils/boolean.js"

export const validate = values => {
  let errors = {}

  if (not(values.email)) {
    errors.email = FORM_CONSTANTS.REQUIRED
  } else if (not(FORM_CONSTANTS.EMAIL.test(values.email))) {
    errors.email = "Veuillez entrer un courriel valide."
  }

  if (not(values.first_name)) errors.first_name = FORM_CONSTANTS.REQUIRED

  if (not(values.last_name)) errors.last_name = FORM_CONSTANTS.REQUIRED

  if (not(values.organisation)) errors.organisation = FORM_CONSTANTS.REQUIRED

  Object.keys(values.address).map(key => {
    if (values[key] === "") return values[key] = FORM_CONSTANTS.REQUIRED
  })

  return errors
}
