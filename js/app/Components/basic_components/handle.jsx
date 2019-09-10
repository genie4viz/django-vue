import React, {PropTypes} from "react";
import classNames from "classnames";

export const Handle = ({isCollapsed, toggleMenu}) => {
    var collapsed = classNames({
      "handle--collapsed": isCollapsed
    })
    var arrowDirection = classNames({
        "handle__icon--rotated": isCollapsed
    })

    return (
        <div className={`handle ${collapsed}`}>
            <button className="handle__button" onClick={toggleMenu}>
                <i className={`icon-Droite handle__icon ${arrowDirection}`}></i>
            </button>
        </div>
    )
}

Handle.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired
}
