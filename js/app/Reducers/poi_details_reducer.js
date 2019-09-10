import * as Actions from "../Constants/constants.jsx";

export function reducer_poiDetails(state = {
  isLoading: false,
  data: {},
  error: false
}, action = null) {
    switch (action.type) {
      case Actions.REQ_POI_DATA:
          return Object.assign({}, state, {isLoading: true, error: false});
      case Actions.RECV_POI_DATA:
          return Object.assign({}, state, {isLoading: false, data: action.data, error: false});
      case Actions.RECV_POI_ERROR:
          return Object.assign({}, state, {isLoading: false, error: true});
      default:
          return state;
    }
}
