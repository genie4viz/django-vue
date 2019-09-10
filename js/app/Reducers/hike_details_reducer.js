import {TRAIL} from "../Actions/hike_details_actions.jsx"

export function reducer_hikeDetails(state = {
  isLoading: false,
  data: {},
  error: false
}, action = null) {
    switch (action.type) {
      case TRAIL.REQUEST:
          return Object.assign({}, state, {isLoading: true, error: false});
      case TRAIL.SUCCESS:
          return Object.assign({}, state, {isLoading: false, data: action.data, error: false});
      case TRAIL.FAILURE:
          return Object.assign({}, state, {isLoading: false, error: true});
      default:
          return state;
    }
}
