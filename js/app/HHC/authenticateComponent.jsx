import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import {push} from "react-router-redux"
import hoistNonReactStatic from "hoist-non-react-statics"
import {isEmpty as _Empty} from "lodash/fp"

import {Spinner} from "../Components/basic_components/spinner.jsx"

import {checkAuth} from "../Actions/login_actions.jsx"
import {not} from "../Utils/boolean.js"

import {SITE_PATH} from "../config.jsx"

const defaults = {
    checkIfAuthorized: (userData) => {
        return not(_Empty(userData))
    },
    checkIfOwner: () => false,
    LoadingSprite: () => {
        return <Spinner/>
    }
}

/**
 * Authorization HOC
 * 
 * Checks authentication and authorization
 * Defines custom redirection when necessary
 */
export default function Authorize(config = {}) {

    /**
     * Chech if a user is logged in
     */
    const {checkIfAuthorized, checkIfOwner, LoadingSprite} = {...defaults, ...config}

    const isAuthorized = (authData, user) => checkIfAuthorized(authData, user)

    const isOwner = (username, routeParams) => username === routeParams.username

    return WrappedComponent => {
        const displayName = WrappedComponent.displayName
            || WrappedComponent.name
            || "Component"

        const mapStateToProps = state => {
            return {
              authed: state.authed,
              user: state.user
            }
        }

        class Authorize extends Component {
            static displayName = `HOC(${WrappedComponent})`

            static propTypes = {
                authed: PropTypes.object.isRequired,
                user: PropTypes.object.isRequired,
            }

            constructor(props) {
                super(props)
            }

            componentWillMount() {
                // Verifiy auth
                const {
                    authed, 
                    user, 
                    dispatch,
                    params
                } = this.props

                if(not(authed.isAuthenticating) && not(isAuthorized(user.profile))) {
                    dispatch(push("/admin/login/"))
                } else if (not(isOwner(authed.username, params))) {
                    dispatch(push("/admin/login/"))
                }
            }

            componentWillReceiveProps(nextProps) {
                return
            }

            render() {
                const {
                    authed,
                    user,
                    params,
                } = this.props

                if (authed.accessToken) {
                    let owner = isOwner(user, params)
                    return <WrappedComponent owner={owner} {...this.props}/>
                } else if (authed.isAuthenticating) {
                    return <LoadingSprite/>
                } else {
                    // Fail
                    return false
                }
            }
        }

        return connect(mapStateToProps)(Authorize)
    }
}
