import axios from "axios"
import {reset} from "redux-form"
import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"
import {API_ROOT} from "../config.jsx"

export const RESERVATION_MAIL = createAsyncRequestType("RESERVATION_MAIL")

export const reservationActions = {
  request: () => createAction(RESERVATION_MAIL.REQUEST),
  success: response => createAction(RESERVATION_MAIL.SUCCESS, {data: response.data}),
  failure: error => createAction(RESERVATION_MAIL.FAILURE, {data: error.data})
}

export const sendReservation = formData => async dispatch => {
  try {
    let response = await axios({
      method: "post",
      data: formData
    })
    if(response.status < 400) {
        dispatch(reset("reservation-form"))
    } else {
      throw new Error(`Erreur ${response.status}`)
    }
    return response
  } catch (err) {
    // TODO add message
    return err
  }
}
