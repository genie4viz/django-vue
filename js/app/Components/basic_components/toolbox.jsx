import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {md} from "../../config.jsx"

export class Toolbox extends Component {
    static propTypes = {
        sheet: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            position: {}
        }
    }

    componentDidMount() {
        this.setState({position: this._postition()})
    }

    render() {
        const {children, title} = this.props
        const {isOpen, position} = this.state
        return (
            <aside
                id="hike-toolbox"
                className="toolbox"
                style={position}
                >
                <header className="toolbox__header" onClick={this._toggleToolboxContent}>
                    <h3 className="toolbox__h3">{title}</h3>
                </header>
                <div className={
                        classNames({
                            "toolbox__content": true,
                            "toolbox__content--hidden": isOpen
                        })
                    }>
                    {children}
                </div>
            </aside>
        )
    }

    _toggleToolboxContent = () => {
        if (this.state.isOpen) {
            this.setState({isOpen: false})
        } else {
            this.setState({isOpen: true})
        }
    }

    _postition = () => {
        let isMobile = md.mobile(), position
        if (isMobile) {
            position = {
                left: 0,
                top: `${document.querySelector(".hero").getBoundingClientRect().bottom - 34}px`
            }
        } else {
            position = {
                left: "auto",
                right: `${document.querySelector(".hike-detail").offsetLeft}px`,
                top: `${
                    document
                    .querySelector(".hero")
                    .getBoundingClientRect()
                    .bottom - document
                    .querySelector("#hike-toolbox header")
                    .offsetHeight}px`
            }
        }
        return position
    }
}
