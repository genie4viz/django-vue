var phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance()

export const validate = values => {
    let errors = {}

    if (!values.email) {
        errors.email = "Ce champ est obligatoire!"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Veuillez entrer un adresse courriel."
    }

    if (!values.first_name) {
        errors.first_name = "Ce champ est obligatoire!"
    }

    if (!values.last_name) {
        errors.last_name = "Ce champ est obligatoire!"
    }

    if (!values.phone_number) {
        errors.phone_number = "Ce champ est obligatoire!"
    }
    // } else if (values.phone_number.length < 12) {
    //     errors.phone_number = "Entrez un numéro de téléphone valide."
    // } else if (values.phone_number.length >= 12) {
    //     if (!phoneUtil.isValidNumber(phoneUtil.parse(`+1 ${values.phone_number}`))) {
    //         errors.phone_number = "Le numéro de téléphone ne semble pas être valide."
    //     }
    // }

    if (!Object.keys(values.people).find(key => values.people[key] > 0)) {
        errors.people = "Vous devez inclure au moins une personne dans la réservation."
    }

    /* Remove dates as required field
    if (!values.reservation_dates) {
        errors.reservation_dates = "Veuillez entrer les dates de votre réservation."
    } else if (!values.reservation_dates.from || !values.reservation_dates.to) {
        errors.reservation_dates = "Veuillez entrer une date de début et de fin."
    }
    */

    return errors
}
