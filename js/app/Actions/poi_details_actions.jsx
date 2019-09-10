/**
 * Created by fbrousseau on 2016-03-10.
 */
import axios from "axios";
import { push } from "react-router-redux"

import * as Actions from "../Constants/constants.jsx";
import { API_ROOT } from "../config.jsx";

/**
 * Action creator to request Showcase data
 * @returns {{type}}
 */
export function requestData() {
    return {
        type: Actions.REQ_POI_DATA
    }
}

/**
 * Action creator to receive Showcase data
 * @param json
 * @returns {{type, data: *}}
 */
export function receiveData(json) {
    return {
        type: Actions.RECV_POI_DATA,
        data: json
    }
}

/**
 * Action creator to return an error
 * @param json
 * @returns {{type, data: *}}
 */
export function receiveError(json) {
    return {
        type: Actions.RECV_POI_ERROR,
        data: json
    }
}

/**
 * Async action creator to request API for search
 * @param  {[type]} url    resource's url
 * @param  {[type]} params form values
 * @return {function}     async call using ajax call
 */
export function getPoi(id) {
    return (dispatch, getState) => {
        dispatch(requestData());
        return axios.get(`${API_ROOT}/point-of-interests/${id}/`, {
            params: {
                "expand": "images,address,contact"
            },
            responseType: "json",
            timeout: 20000
        })
            .then((response) => {
                dispatch(receiveData(response.data));
            })
            .catch((response) => {
                dispatch(receiveError(response.data));
                dispatch(push('/404/'))
            })
    }
}
