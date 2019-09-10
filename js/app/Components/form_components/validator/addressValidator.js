import * as FORM_CONSTANTS from '../constants/constants.js'
import { not } from '../../../Utils/boolean.js'

/* Field level validation */
export const validateStreetName = value => value ? undefined : FORM_CONSTANTS.REQUIRED

export const validateCity = value => value ? undefined : FORM_CONSTANTS.REQUIRED

export const validateCountry = value => value ? undefined : FORM_CONSTANTS.REQUIRED

export const validateProvince = value => value ? undefined : FORM_CONSTANTS.REQUIRED

// TODO: add post code dynamic validation (depending on countries)
export const validatePostalCode = (value, countryName) => {

  if(countryName === 'US') {
    return FORM_CONSTANTS.ZIP_CODE.test(value) ? undefined : "Code postal invalide"
  }
  else if(countryName === 'Canada') {
    return FORM_CONSTANTS.POSTAL_CODE.test(value) ? undefined : "Code postal invalide"
  }
  else {
    return value ? undefined : FORM_CONSTANTS.REQUIRED
  }
  
}
