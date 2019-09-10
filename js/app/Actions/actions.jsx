/**
 * Created by fbrousseau on 2016-03-10.
 */
import axios from "axios"
import api from "../Services/api.js"

import * as Actions from "../Constants/constants.jsx"

import { push } from "react-router-redux"
import {resetPage} from "./pagination_actions.jsx"
import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"
import * as Errors from "./utils/ActionErrors.js"

import {Observable} from "../Utils/misc.js"
import { API_ROOT } from "../config.jsx"

/**
 * SHOWCASE CONSTANTS, ACTION CREATOR AND ASYNC ACTIONS
 */
export const SHOWCASE = createAsyncRequestType("SHOWCASE")

export const showcaseActions = {
    request: () => createAction(SHOWCASE.REQUEST),
    success: response => createAction(SHOWCASE.SUCCESS, {data: response.data}),
    failure: error => createAction(SHOWCASE.FAILURE, {data: error.data})
}

export const fetchShowcase = () => async dispatch => {
    try {
        dispatch(showcaseActions.request())
        let response = await api.fetchShowcase()
        dispatch(showcaseActions.success(response))
    } catch (e) {
        dispatch(showcaseActions.failure(e))
    }
}

/**
 * SEARCH CONSTANTS, ACTION CREATOR AND ASYNC ACTIONS
 */
export const SEARCH_TRAILS = createAsyncRequestType("SEARCH_TRAILS")

export const searchTrailsActions = {
    request: () => createAction(SEARCH_TRAILS.REQUEST),
    success: response => createAction(SEARCH_TRAILS.SUCCESS, {data: response.data}),
    failure: error => createAction(SEARCH_TRAILS.FAILURE, {data: error.data})
}

export const search = formData => async dispatch => {
    try {
        const config = {
            method: 'get',
            url: '/trails/',
            timeout: 200000,
            params: {
              exclude: "images",
              expand: "location",
              ...formData
            },
            validateStatus: status => status < 500,
        }

        dispatch(searchTrailsActions.request())
        let response = await api.fetchSearch(config)

        Errors.checkResponse(response)

        dispatch(searchTrailsActions.success(response))
        dispatch(resetPage())

        dispatch(push("/results/"))
        Observable.emit('OPEN_RESULT_LIST', 1)

        return response

    } catch (e) {


        if (e.message === 'Invalid GeoJSON object.') {
           Observable.emit('OPEN_RESULT_LIST', 1)

         }
         console.log(e)
         dispatch(searchTrailsActions.failure(e))

    }
}


// /**
//  * Action creator to select an hike from the result list and keep it in the state Store
//  * @param  {[type]} hike currently selected hike
//  * @return {[type]} FSA standard action
//  */
// export function selectHikeFromList(hike) {
//     return {
//         type: Actions.SELECT_HIKE_FROM_LIST,
//         hike: hike
//     }
// }
//
// export function clearHikeFromList() {
//     return {
//         type: Actions.CLEAR_HIKE_FROM_LIST
//     }
// }
//
// export function selectPoiFromList(poi) {
//     return {
//         type: Actions.SELECT_POI_FROM_LIST,
//         poi: poi
//     }
// }
//
// export function selectNetwortFromList(network) {
//     return {
//         type: Actions.SELECT_NETWORK_FROM_LIST,
//         hikeNetwork: network
//     }
// }



//Newsletter actions
function submitNewsletterForm() {
    return {
        type: Actions.SUBMIT_NEWSLETTER_FORM
    }
}

function receiveConfirmation(json) {
    return {
        type: Actions.RECEIVE_CONFIRMATION,
        data: json
    }
}

function receiveNewsletterError(json) {
    return {
        type: Actions.RECEIVE_ERROR,
        data: json
    }
}

export function registerToNewsletter(formData) {
    return (dispatch, getState) => {
        dispatch(submitNewsletterForm)
        return axios.post("/lists/{list_id}/members", {
            status: "subscribed",
            email_type: "html",
            language: navigator.language.substring(0,1) || navigator.userLanguage.substring(0,1),
            email_address: formData.email
        }).then(response => {
            dispatch(receiveConfirmation(response.data))
        }).then(response => {
            dispatch(receiveNewsletterError(response.data))
        })
    }
}

// POI Legend
export function selectDynamicLayer(value) {
    return {
        type: Actions.SELECT_DYNAMIC_LAYER,
        value: value
    }
}

export function poiLegendChange(json) {
    return {
        type: Actions.POI_LEGEND_CHANGE,
        data: json
    }
}
