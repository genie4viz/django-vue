import React, { PropTypes } from "react"
import classNames from "classnames"

const sizeEnum = [
    '',
    'mini',
    'tiny',
    'small',
    'medium',
    'large',
    'big',
    'huge',
    'massive',
]

const Button = ({children, onClick, color, isLoadingForm = false, ...props}) => {
    const classes = classNames(
        'ui',
        color,
        {'isLoading': isLoadingForm},
        {...props},
        'button')
    return (
        <button className={classes} onClick={onClick} type="button">
            {children}
        </button>
    )
}

Button.PropTypes = {
    active: PropTypes.bool,
    children: PropTypes.element.isRequired,
    disabled: PropTypes.bool,
    fluid: PropTypes.bool,
    negative: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(sizeEnum),
    loading: PropTypes.bool
}

Button.defaultProps = {
    active: false,
    disabled: false,
    fluid: false,
    negative: false,
    size: ''
}

export default Button
