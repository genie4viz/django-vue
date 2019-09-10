import React, {Component, PropTypes} from "react";
import classNames from "classnames";

export const Tooltip = ({isOpen, toggleToolTip}) => {
    const TooltipOpen = classNames({
        "tooltip__filter-list--open": isOpen
    });

    return (
        <aside className="tooltip">
            <div className="tooltip__header" onClick={toggleToolTip}>
                <h3 className="tooltip__title">Point d'intérêt</h3>
                <button className="ui icon button tooltip__button--ligth">
                    <i className="icon-Ajouter"></i>
                </button>
            </div>
            <ul className={`tooltip__filter-list ${TooltipOpen}`}>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Informations</label>
                        <i className="icon-Information"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Parkings</label>
                        <i className="icon-Parkings"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Restaurants</label>
                        <i className="icon-Restaurants"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Hôtels</label>
                        <i className="icon-Hotels"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Chalet rustique</label>
                        <i className="icon-Chalets_rustiques"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Chalet moderne</label>
                        <i className="icon-Chalets_modernes"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Camping</label>
                        <i className="icon-Campings"></i>
                    </div>
                </li>
                <li>
                    <div className="ui checkbox">
                        <input type="checkbox" name="example"/>
                        <label>Lean-to</label>
                        <i className="icon-Lean-to"></i>
                    </div>
                </li>
            </ul>
        </aside>
    )
}

Tooltip.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleToolTip: PropTypes.func.isRequired
}
