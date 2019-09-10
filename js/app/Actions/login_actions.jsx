import axios from "axios"
import * as Cookies from "js-cookie"
import {push} from "react-router-redux"
import {reset} from "redux-form"

import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"

import {userActions} from "./admin_actions.js"
import {notificationSend} from "./notificationActions.jsx"

import * as Errors from "./utils/ActionErrors.js"

import api from "../Services/api.js"
import {not, and, or, assert} from "../Utils/boolean.js"

import {API_ROOT, COOKIE_PATH, SITE_PATH, BACKGROUND_REFRESH_TOKEN} from "../config.jsx"

//Actions for login and logout
export const FACEBOOK = createAsyncRequestType("FACEBOOK")
export const LOGIN = createAsyncRequestType("LOGIN")
export const REGISTER = createAsyncRequestType("REGISTER")
export const LOGOUT = createAsyncRequestType("LOGOUT")
export const REFRESH_TOKEN = createAsyncRequestType("REFRESH_TOKEN")

/**
 * Object containing action creators for facebook login
 * @type {Object}
 */
export const facebookActions = {
    request: () => createAction(FACEBOOK.REQUEST),
    success: username => createAction(FACEBOOK.SUCCESS, {payload: username}),
    failure: error => createAction(FACEBOOK.FAILURE, {data: error.data})
}

/**
 * Object containing action creators for email login
 * @type {Object}
 */
export const loginActions = {
    request: () => createAction(LOGIN.REQUEST),
    success: username => createAction(LOGIN.SUCCESS, {payload: username}),
    failure: error => createAction(LOGIN.FAILURE, /*{data: error.data}*/)
}

/**
 * Object containing action creators to register a new user
 * @type {Object}
 */
export const registerActions = {
    request: () => createAction(REGISTER.REQUEST),
    success: username => createAction(FACEBOOK.SUCCESS, {payload: username}),
    failure: error => createAction(REGISTER.FAILURE, /*{data: error.data}*/)
}

/**
 * Object containing action creators to logout a user
 * @type {Object}
 */
export const logoutActions = {
    request: () => createAction(LOGOUT.REQUEST),
    success: () => createAction(LOGOUT.SUCCESS),
    failure: error => createAction(LOGOUT.FAILURE)
}

/**
 * Refresh token asuync actions
 * @type {Object}
 */
export const refreshTokenActions = {
    request: () => createAction(REFRESH_TOKEN.REQUEST),
    success: response => createAction(REFRESH_TOKEN.SUCCESS),
    failure: error => createAction(REFRESH_TOKEN.FAILURE)
}

/**
 * Set the token in the store
 * @type {String}
 */
export const SET_TOKEN = "SET_TOKEN"
export const setToken = accessToken => createAction(SET_TOKEN, {accessToken: accessToken})

/**
 * Reset the token in the store (sets it to null or empty)
 * @type {String}
 */
export const RESET_STATE = "RESET_STATE"
export const resetState = () => createAction(RESET_STATE)

/**
 * Start the timer for background fetch
 * @type {String}
 */
export const START_TIMER = "START_TIMER"
export const STOP_TIMER = "STOP_TIMER"
export const timerActions = {
    start: intervalId => createAction(START_TIMER, {
        intervalId: intervalId
    }),
    stop: () => createAction(STOP_TIMER)
}

const startTimer = oldToken => dispatch => {
    const interval = setInterval(() => {
        dispatch(refreshToken(oldToken))
    }, 2700 * 1000)

    dispatch(timerActions.start(interval))
}

export const IS_AUTHENTICATING = "IS_AUTHENTICATING"
export const isAuthenticating = username => createAction(IS_AUTHENTICATING, {payload: username})

/**
 * Post login and post logout actions... Just sets or remove token and navigates somewhere else
 * @return {[type]} [description]
 */
export const postLogout = () => (dispatch, getState) => {
    Cookies.remove(COOKIE_PATH)
    dispatch(resetState())
    dispatch(timerActions.stop())
    dispatch(push(SITE_PATH))
}

export const postLogin = (user, token) => (dispatch, getState) => {
    Cookies.set(COOKIE_PATH, {"token": token, "user": user.username}, {expires: 7})
    dispatch(userActions.setUser({
        user: user
    }))
    dispatch(setToken(token))
    dispatch(startTimer(token))
}

/**
 * Register or log in a user using Facebook Oauth2
 * @param me Facebook user object
 * @returns {function()}
 */
export const loginUserFacebook = me => async dispatch => {
    try {
        dispatch(facebookActions.request())
        let response = await api.postFacebookRequest(me)

        Errors.checkResponse(response)
        // Successful login : we have a valid token and a user
        // We have a valid token and a valid user... let's load the rest
        const {token, user} = response.data
        dispatch(facebookActions.success(user.username))
        dispatch(postLogin(user, token))
        dispatch(push(SITE_PATH))
    } catch (e) {
        dispatch(facebookActions.failure(e))
    }
}

/**
 * Login using email and password
 * @param formData
 * @returns {function()}
 */
export const loginUserByEmail = formData => async dispatch => {
    try {
        dispatch(loginActions.request())
        let response = await api.postLoginRequest(formData)

        Errors.checkResponse(response)
        // Successful login : we have a valid token
        const {token, user} = response.data

        dispatch(loginActions.success(user.username))
        dispatch(postLogin(user, token))
        dispatch(push(SITE_PATH))
        return response
    } catch (e) {
        console.log(e)
        dispatch(notificationSend({label: "app", message: "Problème lors de la connexion. Veuillez reessayer plus tard.", timeout: 3000}))
        dispatch(loginActions.failure(e))
    }
}

/**
 * Login using email and password
 * @param formData
 * @returns {function()}
 */
export const loginAdminByEmail = formData => async dispatch => {
    try {
        dispatch(loginActions.request())
        let response = await api.postLoginRequest(formData)

        Errors.checkResponse(response)
        // Successful login : we have a valid token
        const {token, user} = response.data

        dispatch(loginActions.success(user.username))
        dispatch(postLogin(user, token))
        dispatch(push(`/admin/${user.username}/`))
        return response
    } catch (e) {
        console.log(e)
        dispatch(notificationSend({
            label: "app", 
            message: "Problème lors de la connexion. Veuillez verifier votre non d'utilisateur ou mot de passe.", 
            timeout: 3000
        }))
        dispatch(loginActions.failure(e))
    }
}

/**
 * Register using email and password
 * @param formData
 * @returns {function()}
 */
export const registerUserByEmail = formData => async dispatch => {
    try {
        dispatch(registerActions.request())
        let response = await api.postRegisterRequest(formData)

        Errors.checkResponse(response)
        // Successful login : we have a valid token
        const {token, user} = response.data
        dispatch(registerActions.success(user.username))
        dispatch(postLogin(user, token))
        dispatch(push(SITE_PATH))
    } catch (e) {
        dispatch(registerActions.failure(e))
    }
}

export const logout = () => async (dispatch, getState) => {
    try {
        dispatch(logoutActions.request())
        await api.postLogout(getState().authed.accessToken)
        dispatch(loginActions.success())
    } catch (e) {
        dispatch(logoutActions.failure(e))
    } finally {
        /**
         * Whatever happens, when we log out, we want to stop the process of
         * refreshing the token
         */
        dispatch(postLogout())
        dispatch(notificationSend({label: "app", message: "Vous êtes déconnecté", timeout: 2000}))
    }
}

const refreshToken = oldToken => async (dispatch, getState) => {
    try {
        dispatch(refreshTokenActions.request())
        let response = await api.postRefreshToken(oldToken)

        Errors.checkResponse(response)

        // Token is good as new, set it and continue as is
        dispatch(refreshTokenActions.success())
        dispatch(setToken(response.data.token))
    } catch (e) {
        dispatch(refreshTokenActions.failure(e))
        dispatch(postLogout())
        dispatch(notificationSend({label: "app", message: "Votre session est expirée. Veuillez vous connecter à nouveau.", timeout: 2000}))
    }
}
