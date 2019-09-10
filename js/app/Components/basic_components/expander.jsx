import React, { Component, PropTypes } from 'react';
import classNames from "classnames";

class Expander extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isExpanded: null,
        }

        this.handleToggle = this.handleToggle.bind(this)
    }

    render() {
        const {children, title} = this.props
        const {isExpanded} = this.state
        const expandedClass = classNames("expander-trigger", {"expander-hidden": isExpanded})

        return (
            <div className="expander">
                <div 
                    className={expandedClass} 
                    onClick={this.handleToggle}
                    >
                    {title}
                    <i className="icon-Plus"></i>
                </div>
                <div className="expander-content">
                    {children}
                </div>
            </div>
        );
    }

    handleToggle() {
        const {isExpanded} = this.state
        if (isExpanded) {
            this.setState({isExpanded: false})
        } else {
            this.setState({isExpanded: true})
        }
    }
}

Expander.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element,
    ]).isRequired,
    title: PropTypes.string.isRequired
};

export default Expander;