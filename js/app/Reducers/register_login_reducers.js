/**
 * Created by fbrousseau on 2016-04-06.
 */
import * as Actions from "../Constants/constants.jsx"

import {
    FACEBOOK,
    LOGIN,
    IS_AUTHENTICATING,
    LOGOUT,
    REGISTER,
    RESET_STATE,
    SET_TOKEN,
    SET_USER,
    USER,
    REFRESH_TOKEN,
    START_TIMER,
    STOP_TIMER
} from "../Actions/login_actions.jsx"

const initialState = {
    accessToken: null,
    username: null,
    isAuthenticating: false,
    registering: {
        isLoading: false,
        error: false
    },
    loggingIn: {
        isLoading: false,
        error: false
    },
    loggingOut: {
        isLoading: false,
        error: false
    },
    token: {
        isLoading: false,
        error: false
    },
    timer: {
        isOn: false,
        intervalId: null
    },
}

export function reducer_authed (state = initialState, action = null) {
    switch (action.type) {
        case SET_TOKEN:
            return {...state, isAuthenticating: false, accessToken: action.accessToken}
        case RESET_STATE:
            return initialState
        case IS_AUTHENTICATING:
            return {...state, isAuthenticating: true, username: action.payload}
        case START_TIMER:
            return {...state, isOn: true, intervalId: action.intervalId}
        case STOP_TIMER:
            clearInterval(state.timer.intervalId)
            return {...initialState.timer}
        case FACEBOOK.REQUEST:
        case LOGIN.REQUEST:
            return {...state, loggingIn: {...state.loggingIn, isLoading: true}}
        case FACEBOOK.SUCCESS:
        case LOGIN.SUCCESS:
            return {...state, username: action.payload, loggingIn: {...state.loggingIn, isLoading: false}}
        case FACEBOOK.FAILURE:
        case LOGIN.FAILURE:
            return {...state, loggingIn: {...state.loggingIn, isLoading: false, error: true}}
        case REGISTER.REQUEST:
            return {...state, registering: {...state.registering, isLoading: true}}
        case REGISTER.SUCCESS:
            return {...state, username: action.payload, registering: {...state.registering, isLoading: false}}
        case REGISTER.FAILURE:
            return {...state, registering: {...state.registering, isLoading: false, error: true}}
        case LOGOUT.REQUEST:
            return {...state, loggingOut: {...state.loggingOut, isLoading: true}}
        case LOGOUT.SUCCESS:
            return {...state, loggingOut: {...state.loggingOut, isLoading: false}}
        case LOGOUT.FAILURE:
            return {...state, loggingOut: {...state.loggingOut, isLoading: false, error: true}}
        case REFRESH_TOKEN.REQUEST:
            return {...state, token: {...state.token, isLoading: true}}
        case REFRESH_TOKEN.SUCCESS:
            return {...state, token: {...state.token, isLoading: false}}
        case REFRESH_TOKEN.FAILURE:
            return {...state, token: {...state.token, isLoading: false, error: true}}
        default:
            return state
    }
}
