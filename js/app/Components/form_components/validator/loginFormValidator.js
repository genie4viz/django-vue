// Sync validation
export const validate = values => {
    let errors = {};

    if (!values.username) {
        errors.username = "Ce champ est obligatoire!";
    }

    if (!values.password) {
        errors.password = "Ce champ est obligatoire!";
    }

    return errors;
}
