export const validate = values => {
    const errors = {};

    if (!values.search_term) {
        errors.search_term = "SVP définir une région, une ville ou un parc";
    }

    return errors;
}
