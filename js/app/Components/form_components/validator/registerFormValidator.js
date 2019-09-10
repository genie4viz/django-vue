import axios from "axios";

export const validate = values => {
    let errors = {};

    if (!values.email) {
        errors.email = "Ce champ est obligatoire!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Veuillez entrer un adresse courriel valide.";
    }

    if(!values.first_name) {
      errors.first_name = "Ce champ est obligatoire!";
    }

    if(!values.last_name) {
      errors.last_name = "Ce champ est obligatoire!";
    }

    if (!values.password1) {
        errors.password1 = "Ce champ est obligatoire!";
    } else if (!(values.password1.length >= 8)) {
        errors.password1 = "Votre mot de passe doit contenir au moins 8 caractères.";
    } else if (/^[#$%^&*()+=\[\]{};':"\\|,.<>\/?]*$/.test(values.password1)) {
        errors.password1 = "Seule les lettres de A à Z, chiffres de 0 à 9 et les caractères _, -, @ sont permis.";
    } else if (!/\d/.test(values.password1)) {
        errors.password1 = "Votre nom d'utilisateur doit contenir au moins un chiffre.";
    }

    if (!values.password2) {
        errors.password2 = "Ce champ est obligatoire!";
    } else if (values.password1 !== values.password2) {
        errors.password2 = "Votre mot de passe est différent du précédent.";
    }

    return errors;
}
