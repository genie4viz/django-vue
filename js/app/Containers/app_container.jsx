/**
 * Created by fbrousseau on 2016-03-10.
 */
import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import * as Cookies from "js-cookie"

import Toaster from "../Components/basic_components/notifications.jsx"

import * as LoginsActions from "../Actions/login_actions.jsx"
import {notificationSend} from "../Actions/notificationActions.jsx"

import api from "../Services/api.js"

import {not} from "../Utils/boolean.js"
import {COOKIE_PATH} from "../config.jsx"

const mapStateToProps = state => {
    return {
        authed: state.authed
    }
}

/*
 App component wrapping every pages
 */
export class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,

    }

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const {dispatch} = this.props

        try {
            const {token, user} = Cookies.getJSON(COOKIE_PATH)
            user ? dispatch(LoginsActions.isAuthenticating(user)) : dispatch(LoginsActions.isAuthenticating(null))
            // Refresh token
            this._verifyToken(token)
            .then(value => {
                if (value instanceof Error) throw new Error("Clé expirée")

                dispatch(LoginsActions.postLogin(value.data.user, token))
            })
            .catch(err => {
                dispatch(LoginsActions.postLogout())
            })

        } catch (err) {
            if (err.constructor === SyntaxError) {
                dispatch(LoginsActions.postLogout())
            }
        }
    }

    /*
     Render methode, children refers to subviews in the tree structure.
     When we navigate to other pages, we really just re-render the children
     */
    render() {
        return (
            <div className="wrapper">
                <Toaster/>
                {this.props.children}
            </div>
        )
    }

    _verifyToken = async token => {
        const {dispatch} = this.props
        try {
            let response = await api.postVerifyToken(token)

            if (not(response.status < 400)) {
                throw new Error(`Erreur ${response.status}: ${response.statusText} - ${response.data.detail}`)
            }
            return response
        } catch (e) {
            dispatch(LoginsActions.postLogout())
            dispatch(notificationSend({label: "app", message: "Votre session a expirée.", timeout: 2000}))
            return e
        }
    }
}

export default connect(mapStateToProps)(App)
