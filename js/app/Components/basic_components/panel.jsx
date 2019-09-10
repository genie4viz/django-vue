import React, {Component, PropTypes} from "react"
import ui from 'redux-ui'
import classNames from "classnames"

//import {Handle} from "../../Components/basic_components/handle.jsx"

export class SidePanel extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        isVisible: PropTypes.bool.isRequired,
        position: PropTypes.string,
    }

    static defaultProps = {
        position: "left",
        isVisible: true
    }

    handleToggleMenu() {
        const {ui, updateUI} = this.props

        if (this.props.ui.isVisible) {
            this.props.updateUI({isVisible: false})
        } else {
            this.props.updateUI({isVisible: true})
        }
    }

    render() {
        const { children, position, ui: {isVisible} } = this.props

        let isPaneVisible = classNames({
            "sliding-panel--is-visible": isVisible
        }),
        collapsed = classNames({
            "handle--collapsed": isVisible,
        }),
        arrowDirection = classNames({
            "handle__icon--rotated": isVisible
        })

        return (
            <div>
                <div className={ `sliding-panel sliding-panel--${position} ${isPaneVisible}` }>
                    { children }
                </div>
                <div className={`handle ${collapsed}`}>
                    <button className="handle__button" onClick={this.handleToggleMenu.bind(this)}>
                        <i className={`icon-Droite handle__icon ${arrowDirection}`}></i>
                    </button>
                </div>
            </div>
        )
    }
}

/*export const Handle = ({isCollapsed, toggleMenu}) => {
    var collapsed = classNames({
      "handle--collapsed": isCollapsed,
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
}*/

SidePanel = ui({key: "side-panel", state: {isVisible: true}})(SidePanel)