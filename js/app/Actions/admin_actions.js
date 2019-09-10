/**
 * Created by fbrousseau on 2016-06-13. Modified by Matty Wang in Aug, 2017
 */
import axios from "axios"
import api from "../Services/api.js"

import createHistory from 'history/lib/createBrowserHistory'

import { resetPage } from "./pagination_actions.jsx"
import { notificationSend } from './notificationActions.jsx';

import { createAsyncRequestType, createAction } from "./utils/actionCreators.js"
import * as Errors from "./utils/ActionErrors.js"
import { normalizeFormData, normalizeTSFormData } from "./utils/normalize.js"
import { API_ROOT } from "../config.jsx"
import { not } from "../Utils/boolean.js"

import { parseAdminLocations } from "../Components/utils/utils.js"
/**
 * Object containing action creators to get user detail on login
 * @type {Object}
 */
export const SET_USER = "SET_USER"
export const userActions = {
    setUser: data => createAction(SET_USER, data)
}


/*
  USER PROFILE ELEMENTS
 */
export const USER_TRAILS = createAsyncRequestType("USER_TRAILS")

export const userTrailsActions = {
    request: () => createAction(USER_TRAILS.REQUEST),
    success: data => createAction(USER_TRAILS.SUCCESS, data),
    failure: error => createAction(USER_TRAILS.FAILURE, { data: error.data })
}

export const getUserTrails = (username) => async(dispatch, getState) => {
    try {
        dispatch(userTrailsActions.request())

        const requestConfig = {
            method: 'get',
            url: `/users/${username}/trails/`,
            params: {
                expand: "images",
            }
        }

        let response = await api.getUserTrails(requestConfig)

        dispatch(userTrailsActions.success({
            trails: response.data
        }))
        dispatch(resetPage())

        return response
    } catch (e) {
        console.log(e)
        if (e instanceof Error) {
            dispatch(userTrailsActions.failure(e))
        }
    }
}

export const USER_LOCATIONS = createAsyncRequestType("USER_LOCATION")

export const userLocationsActions = {
    request: () => createAction(USER_LOCATIONS.REQUEST),
    success: data => createAction(USER_LOCATIONS.SUCCESS, data),
    failure: error => createAction(USER_LOCATIONS.FAILURE, { data: error.data })
}

export const getUserTrailSectionsByLocations = (location_id) => async(dispatch, getState) => {
    try {
      dispatch(userTrailsectionsActions.request())
      const requestConfig = {
        method: 'get',
        url: `/trailsections?location=${location_id}`
      }

      let response = await api.getUserTrailSectionsByLocations(requestConfig)

      dispatch(userTrailsectionsActions.success({ trailsections: response.data }))
      return response

    } catch (err) {
      console.log(err)
    }
}

export const getUserLocations = (username) => async(dispatch, getState) => {
    try {
        dispatch(userLocationsActions.request())
        const requestConfig = {
            method: 'get',
            url: `/users/${username}/locations/`,
            params: {
                expand: "contact,images,address"
            }
        }

        let response = await api.getUserLocations(requestConfig)

        if(response.data) {
          dispatch(getUserTrailSectionsByLocations(parseAdminLocations(response.data)))
        }

        dispatch(userLocationsActions.success({ locations: response.data }))
        return response

    } catch (err) {
        console.log(err)
        if (err instanceof Error) {
            dispatch(userLocationsActions.failure(err))
        }
    }

}

// Get trailsections by the user's locations
export const USER_TRAILSECTIONS = createAsyncRequestType("USER_TRAILSECTIONS")

export const userTrailsectionsActions = {
    request: () => createAction(USER_TRAILSECTIONS.REQUEST),
    success: data => createAction(USER_TRAILSECTIONS.SUCCESS, data),
    failure: error => createAction(USER_TRAILSECTIONS.FAILURE, { data: error.data })
}

/*
 * Filter by regions so we dont have a zillion trails
 */
export const FILTER_BY_REGION = createAsyncRequestType("FILTER_BY_REGION")

export const filterByRegionsActions = {
    request: () => createAction(FILTER_BY_REGION.REQUEST),
    success: data => createAction(FILTER_BY_REGION.SUCCESS, data),
    failure: error => createAction(FILTER_BY_REGION.FAILURE, { data: error.data })
}

export const filterByRegions = regionId => async(dispatch, getState) => {
    try {
        dispatch(filterByRegionsActions.request())

        let username = getState().user.profile.username,
            requestConfig = {
                method: 'get',
                url: `/users/${username}/trails/`,
                params: {
                    region_id: regionId,
                    exclude: 'trail_sections'
                }
            },
            response = await api.getFilteredTrails(requestConfig)

        dispatch(filterByRegionsActions.success({ trails: response.data }))
        dispatch(resetPage())

        return response
    } catch (e) {
        console.log(e)
        if (e instanceof Error) {
            dispatch(filterByRegionsActions.failure(e))
        }
    }
}

export const SUBMIT_MODIF = createAsyncRequestType("SUBMIT_MODIF")

export const submitModifActions = {
    request: () => createAction(SUBMIT_MODIF.REQUEST),
    success: (collection, data) => createAction(SUBMIT_MODIF.SUCCESS, { meta: { collection }, payload: data }),
    failure: error => createAction(SUBMIT_MODIF.FAILURE, { data: error.data })
}

// Modify a trail Section
export const submitTrailSectionModif = formData => async(dispatch, getState) => {
  try {
    const requestConfig = {
      method: "patch",
      url: `/trailsections/${formData.trailsection_id}/`,
      headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
      data: normalizeTSFormData(formData)
    }
    dispatch(submitModifActions.request())
    let response = await api.makeUpdateRequest(requestConfig)
    dispatch(submitModifActions.success('trailsections', response.data))
    dispatch(notificationSend({
        label: "app",
        message: "Changements enregistrés",
        timeout: 2000
    }))

    createHistory().goBack()

    return response
  } catch (err) {
    console.log(err)
    dispatch(notificationSend({
        label: "app",
        message: "Erreur lors de la sauvegarde",
        timeout: 2000
    }))
    dispatch(submitModifActions.failure(err))
  }
}

export const submitTrailModifications = formData => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "patch",
            url: `/trails/${formData.trail_id}/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
            data: normalizeFormData(formData)
        }
        dispatch(submitModifActions.request())
        let response = await api.makeUpdateRequest(requestConfig)
        dispatch(submitModifActions.success('trails', response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))
        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la sauvegarde",
            timeout: 2000
        }))
        dispatch(submitModifActions.failure(err))
    }
}

export const submitLocationModifications = formData => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "patch",
            url: `/locations/${formData.location_id}/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
            data: normalizeFormData(formData)
        }
        dispatch(submitModifActions.request())
        let response = await api.makeUpdateRequest(requestConfig)
        dispatch(submitModifActions.success("locations", response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))
        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la sauvegarde",
            timeout: 2000
        }))
        dispatch(submitModifActions.failure(err))
    }
}

// Create new location actions and async actions
export const SUBMIT_CREATE = createAsyncRequestType("SUBMIT_CREATE")

export const submitCreateActions = {
    request: () => createAction(SUBMIT_CREATE.REQUEST),
    success: (collection, data) => createAction(SUBMIT_CREATE.SUCCESS, { meta: { collection }, payload: data }),
    failure: error => createAction(SUBMIT_CREATE.FAILURE, { data: error.data })
}

export const submitCreateNewLocation = formData => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "post",
            url: "/locations/",
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
            data: normalizeFormData(formData)
        }
        dispatch(submitCreateActions.request())
        let response = await api.makeCreateRequest(requestConfig)

        // Check if server response is success. Throw error if not
        Errors.checkResponse(response.response)

        dispatch(submitCreateActions.success("locations", response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))
        // TODO add the new location to the list of user locations
        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la sauvegarde",
            timeout: 2000
        }))
        dispatch(submitModifActions.failure(err))
    }
}

export const submitCreateNewTrail = formData => async(dispatch, getState) => {
    try {
        const accessToken = getState().authed.accessToken

        Errors.checkToken(accessToken)

        let requestConfig = {
            method: 'post',
            url: '/trails/',
            headers: { 'Authorization': `JWT ${accessToken}` },
            data: normalizeFormData(formData)
        }

        dispatch(submitCreateActions.request())
        let response = await api.makeCreateRequest(requestConfig)

        Errors.checkResponse(response.response)

        dispatch(submitCreateActions.success('trails', response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))
        return response
    } catch (error) {
        if (err.constructor === Errors.AccessTokenError) {
            // log to console
            console.log(err.stack)
        } else if (err.constructor === Errors.BadApiResponseError) {
            dispatch(notificationSend({
                label: "app",
                message: "Erreur lors de la sauvegarde",
                timeout: 2000
            }))
            dispatch(submitModifActions.failure(err))
        }
    }
}

export const submitCreateTrailSection = formData =>  async(dispatch, getState) => {
    try {
        const accessToken = getState().authed.accessToken

        Errors.checkToken(accessToken)

        let requestConfig = {
            method: 'post',
            url: '/trailsections/',
            headers: { 'Authorization': `JWT ${accessToken}` },
            data: normalizeTSFormData(formData)
        }

        dispatch(submitCreateActions.request())
        let response = await api.makeCreateRequest(requestConfig)

        Errors.checkResponse(response.response)

        dispatch(submitCreateActions.success('trailsections', response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))

        createHistory().goBack()

        return response
    } catch (err) {
        if (err.constructor === Errors.AccessTokenError) {
            // log to console
            console.log(err.stack)
        } else if (err.constructor === Errors.BadApiResponseError) {
            dispatch(notificationSend({
                label: "app",
                message: "Erreur lors de la sauvegarde",
                timeout: 2000
            }))
            dispatch(submitModifActions.failure(err))
        }
    }
}


/**
 * Delete actions
 */
export const SUBMIT_DELETE = createAsyncRequestType("SUBMIT_DELETE")

export const submitDeleteActions = {
    request: () => createAction(SUBMIT_DELETE.REQUEST),
    success: (collection, id) => createAction(SUBMIT_DELETE.SUCCESS, { meta: { collection }, payload: id }),
    failure: error => createAction(SUBMIT_DELETE.FAILURE)
}

export const submitDeleteTrailSection = id => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "delete",
            url: `/trailsections/${id}/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` }
        }

        dispatch(submitDeleteActions.request())
        let response = await api.makeDeleteRequest(requestConfig)

        Errors.checkResponse(response.response)

        dispatch(submitDeleteActions.success("trailsections", id))
        dispatch(notificationSend({
            label: "app",
            message: "Élément supprimé avec succès",
            timeout: 2000
        }))

        createHistory().goBack()

        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la suppression",
            timeout: 2000
        }))
        dispatch(submitModifActions.failure(err))
        return err
    }
}

export const submitDeleteTrail = id => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "delete",
            url: `/trails/${id}/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` }
        }

        dispatch(submitDeleteActions.request())
        let response = await api.makeDeleteRequest(requestConfig)

        Errors.checkResponse(response.response)

        dispatch(submitDeleteActions.success("trails", id))
        dispatch(notificationSend({
            label: "app",
            message: "Élément supprimé avec succès",
            timeout: 2000
        }))
        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la suppression",
            timeout: 2000
        }))
        dispatch(submitModifActions.failure(err))
        return err
    }
}

export const SUBMIT_DELETE_LOCATION = createAsyncRequestType("SUBMIT_DELETE_LOCATION")

export const submitDeleteLocationActions = {
    request: () => createAction(SUBMIT_DELETE_LOCATION.REQUEST),
    success: (collection, data) => createAction(SUBMIT_DELETE_LOCATION.SUCCESS, { meta: { collection }, payload: data }),
    failure: error => createAction(SUBMIT_DELETE_LOCATION.FAILURE)
}

export const submitDeleteLocation = id => async(dispatch, getState) => {
    try {
        const requestConfig = {
            method: "delete",
            url: `/locations/${id}/delete/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` }
        }

        dispatch(submitDeleteLocationActions.request())
        let response = await api.makeDeleteRequest(requestConfig)

        Errors.checkResponse(response.response)

        dispatch(submitDeleteLocationActions.success("locations", response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Un courriel a été envoyé à nos administrateurs pour vérification. Merci.",
            timeout: 5000
        }))
        return response
    } catch (err) {
        console.log(err)
        dispatch(notificationSend({
            label: "app",
            message: "Erreur lors de la suppression",
            timeout: 2000
        }))
        dispatch(submitDeleteLocationActions.failure(err))
        return err
    }
}

export const SUBMIT_PROFILE_MODIF = createAsyncRequestType("SUBMIT_PROFILE_MODIF")

export const submitProfileModificationActions = {
    request: () => createAction(SUBMIT_PROFILE_MODIF.REQUEST),
    success: data => createAction(SUBMIT_PROFILE_MODIF.SUCCESS, { payload: data }),
    failure: error => createAction(SUBMIT_PROFILE_MODIF.FAILURE, { data: error.data })
}

export const submitProfileModifications = formData => async(dispatch, getState) => {
    try {

        const requestConfig = {
            method: "patch",
            url: `/users/${getState().user.profile.username}/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
            data: formData
        }

        dispatch(submitProfileModificationActions.request())
        let response = await api.makeUpdateRequest(requestConfig)
        Errors.checkResponse(response.response)

        dispatch(submitProfileModificationActions.success(response.data))
        dispatch(notificationSend({
            label: "app",
            message: "Changements enregistrés",
            timeout: 2000
        }))
        return response
    } catch (err) {
        if (err.constructor === Errors.AccessTokenError) {
            // log to console
            console.log(err.stack)
        } else if (err.constructor === Errors.BadApiResponseError) {
            dispatch(notificationSend({
                label: "app",
                message: "Erreur lors de la sauvegarde",
                timeout: 2000
            }))
            dispatch(submitModifActions.failure(err))
        }
    }
}

// ACTIONS FOR SUPERTRAILADMIN

export const GET_ADMIN = createAsyncRequestType("GET_ADMIN")

export const getAdminsActions = {
    request: () => createAction(GET_ADMIN.REQUEST),
    success: data => createAction(GET_ADMIN.SUCCESS, data),
    failure: error => createAction(GET_ADMIN.FAILURE, { data: error.data })
}

export const getAdmins = username => async(dispatch, getState) => {
    try {
        dispatch(getAdminsActions.request())
        const requestConfig = {
            method: 'get',
            url: `/users/${username}/admins/`,
            headers: { 'Authorization': `JWT ${getState().authed.accessToken}` },
            params: {
                expand: 'phone_number',
                exclude: "my_hikes,park"
            }
        }

        let response = await api.getAdmins(requestConfig)

        dispatch(getAdminsActions.success({ admins: response.data }))
            //dispatch(resetPage())

        return response
    } catch (e) {
        console.log(e)
        if (e instanceof Error) {
            dispatch(getAdminsActions.failure(e))
        }
    }
}

export const ORDER_BY = "ORDER_BY"
export const orderCollection = (collection, field, order) => createAction(ORDER_BY, {meta: {collection, field}, payload: order})
