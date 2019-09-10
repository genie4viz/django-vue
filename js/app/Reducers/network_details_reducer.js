import Immutable from "immutable"

import {NETWORK, NETWORK_TRAILS} from "../Actions/network_details_actions.jsx"

const initialData = {
  isLoading: false,
  details: {},
  error: false,
  trails: {}
}

export function reducer_hikeNetworkDetails(state = initialData, action = null) {
  state = Immutable.fromJS(state)
  switch (action.type) {
    case NETWORK.REQUEST: {
      return state
        .set('isLoading', true)
        .toJS()
    }
    case NETWORK.SUCCESS: {
      const {network, trails} = action.payload
      return state
        .set('details', network)
        .set('trails', trails)
        .set('isLoading', false)
        .toJS()
    }
    case NETWORK.FAILURE:{
      return state
        .set('isLoading', false)
        .set('error', true)
        .toJS()
    }
    default:
      return state.toJS()
  }
}
