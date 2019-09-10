import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'

export const ModalContent = props => {
    return (
        <div className="md-content">
            {props.title}
            <div>{props.children}</div>
        </div>
    )
}

ModalContent.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]).isRequired,
}

export const ModalActions = props => {
    return (
        <div>
            {props.children}
        </div>
    )
}

export class ModalComponent extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        basic: PropTypes.bool,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array,
        ]).isRequired,
        size: PropTypes.string.isRequired,
    }

    static defaultProps = {
        active: false,
        basic: false,
        size: ''
    }

    render () {
        const {active, basic, children, size} = this.props

        const modal = classNames('md-modal', "md-effect-1",
        {
            "md-show": active
        })

        return (
            <div className={modal}>
                {children}
            </div>
        )
    }
}