import React, {Component, PropTypes} from "react"
import CssTransitionGroup from "react-addons-css-transition-group"
import {connect} from "react-redux"

const Toast = ({message, position, type}) => {
    return (
        <div className={`toast toast--${type} toast--${position}`}>
            <div className={`ui ${type} olive floating message`}>
                <p>{message}</p>
            </div>
        </div>
    )
}

Toast.defaultProps = {
    position: "top",
    type: "info"
}

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['top', 'bottom', 'corner']),
    type: PropTypes.oneOf(['succes', 'info', 'succes', 'error'])
}

const mapStateToProps = state => {
    return {
        toasts: state.notifications
    }
}

export class Toaster extends Component {
    static propTypes = {
        label: PropTypes.string,
        transitionEnterTimeout: PropTypes.number.isRequired,
        transitionLeaveTimeout: PropTypes.number.isRequired,
        toasts: PropTypes.array
    }

    static defaultProps = {
        label: "app",
        transitionEnterTimeout: 1000,
        transitionLeaveTimeout: 1000,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const {toasts, transitionEnterTimeout, transitionLeaveTimeout} = this.props

        let items = toasts.map(toast => (
            <Toast
                key={toast.id}
                {...toast}
                />
        ))

        return (
            <div className="toasts">
                <CssTransitionGroup transitionName={{
                    enter: 'toast--enter',
                    enterActive: 'toast--enter-active',
                    leave: 'toast--leave',
                    leaveActive: 'toast--leave-active',
                }}
                transitionEnterTimeout={transitionEnterTimeout}
                transitionLeaveTimeout={transitionLeaveTimeout}
                >
                    {items}
                </CssTransitionGroup>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Toaster)
