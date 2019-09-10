import React, { PropTypes } from "react";
import classNames from "classnames";

export const CheckboxWithLabel = ({location, value, onChange}) => {
    const labelColor = classNames({
        "label--white": location === "/",
        "label--black": location.includes("results")
    })

    return (
        <div className="ui checkbox checkbox--padding">
            <input id="dog-allowed" type="checkbox" checked={value ? true : false} onChange={onChange}/>
            <label htmlFor="dog-allowed" className={labelColor}>Chien accept&eacute;</label>
        </div>
    )
}

CheckboxWithLabel.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]).isRequired,
    location: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}
