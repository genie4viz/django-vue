const REQUIRED = "Ce champ est obligatoire"
const POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
//for u.s
const ZIP_CODE = /(^\d{5}$)|(^\d{5}-\d{4}$)/
const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const WEBSITE = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

const CONTACT_TYPE = {
    PHONE: 'Téléphone',
    EMAIL: 'Courriel',
    SITE_INTERNET: 'Site Internet',
}

export {CONTACT_TYPE, EMAIL, POSTAL_CODE, ZIP_CODE, REQUIRED, WEBSITE}
