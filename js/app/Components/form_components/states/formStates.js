import classNames from 'classnames'
import curry from "../../../Utils/functional.js"

const _composeFormState = (fn, submitting) => {
    return fn("ui", { "loading": submitting }, "form")
}

export const FormState = curry(_composeFormState)(classNames)

const _composeFieldState = (fn, inline, disabled, error, required) => {
    return fn({
        required,
        inline,
        disabled,
        "field": true,
        error
    })
}

export const FieldState = curry(_composeFieldState)(classNames)