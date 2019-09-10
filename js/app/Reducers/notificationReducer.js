import {NOTIFICATION} from '../Actions/notificationActions.jsx'

const initialState = []

export const notification_reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION.SEND:
      return [...[], action.data]
    case NOTIFICATION.DISMISS:
      return state.filter(item => {
        item.id !== action.id
      })
    case NOTIFICATION.CLEAR:
     return initialState
    default:
      return state
  }
}
