/**
 * Created by fbrousseau on 2016-06-13.
 */
import axios from "axios"
import api from "../Services/api.js"

import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"
import { API_ROOT } from "../config.jsx"

import { push } from "react-router-redux"

export const NETWORK = createAsyncRequestType("NETWORK")
export const NETWORK_TRAILS = createAsyncRequestType("NETWORK_TRAILS")

export const networkActions = {
  request: () => createAction(NETWORK.REQUEST),
  success: (network, trails) => createAction(NETWORK.SUCCESS, {payload: {network, trails}}),
  failure: () => createAction(NETWORK.FAILURE)
}

export const loadNetworkDetails = id => async dispatch => {
  try {
    dispatch(networkActions.request())

    let response = await api.fetchHikeNetwork(id)
    const [network, trails] = response

    dispatch(networkActions.success(network.data, trails.data))
    return response
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      dispatch(networkActions.failure())
      dispatch(push('/404/'))
    }
  }
}
