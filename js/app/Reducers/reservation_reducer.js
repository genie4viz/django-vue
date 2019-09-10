import {RESERVATION_MAIL} from "../Actions/reservationActions.jsx"

const initialData = {
  isLoading: false,
  data: {},
  error: false
}

export function reducer_reservation(state=initialData, action = null) {
  switch (action.type) {
    case RESERVATION_MAIL.REQUEST:
      return {...state, isLoading: true}
    case RESERVATION_MAIL.SUCCESS:
      return {...state, isLoading: false, data: action.data}
    case RESERVATION_MAIL.FAILURE:
      return {...state, isLoading: false, error: true}
    default:

  }
}
