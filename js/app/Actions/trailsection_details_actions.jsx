import axios from "axios"
import api from "../Services/api.js"

import { push } from "react-router-redux"

import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"

export const TRAILSECTION = createAsyncRequestType("TRAILSECTION")

export const trailsectionActions = {
  request: () => createAction(TRAILSECTION.REQUEST),
  success: response => createAction(TRAILSECTION.SUCCESS, {data: response.data}),
  failure: error => createAction(TRAILSECTION.FAILURE, {data: error.data})
}

export const loadTrailsectionDetails = (id) => async dispatch => {
  try {
    dispatch(trailsectionActions.request())
    let response = await api.fetchTrailsection(id)
    dispatch(trailsectionActions.success(response))
  } catch (e) {
    console.log(e);
    dispatch(trailsectionActions.failure(e))
    dispatch(push('404/'))
  }
}
