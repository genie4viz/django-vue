/**
 * Created by fbrousseau on 2016-03-10.
 */
import axios from "axios"
import api from "../Services/api.js"

import { push } from "react-router-redux"

import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"

export const TRAIL = createAsyncRequestType("TRAIL")

export const trailActions = {
    request: () => createAction(TRAIL.REQUEST),
    success: response => createAction(TRAIL.SUCCESS, {data: response.data}),
    failure: error => createAction(TRAIL.FAILURE, {data: error.data})
}

export const loadTrailDetails = id => async dispatch => {
    try {
        dispatch(trailActions.request())
        let response = await api.fetchHike(id)
        dispatch(trailActions.success(response))
    } catch (e) {
        console.log(e)
        dispatch(trailActions.failure(e))
        dispatch(push('/404/'))
    }
}
