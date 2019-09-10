import {TRAILSECTION} from  "../Actions/trailsection_details_actions.jsx"

export function reducer_trailsectionDetails(state = {
  isLoading: false,
  data: {},
  error: false
}, action = null) {
  switch (action.type) {
    case TRAILSECTION.REQUEST:
        return Object.assign( {}, state, {isLoading: true, error: false});
    case TRAILSECTION.SUCCESS:
        return Object.assign({}, state, {isLoading: false, data: action.data, error: false});
    case TRAILSECTION.FAILURE:
        return Object.assign({}, state, {isLoading: false, error: true});
    default:
        return state;
  }
}
