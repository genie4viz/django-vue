import Immutable from "immutable"

import {
    SET_USER,
    USER_TRAILS,
    USER_LOCATIONS,
    USER_TRAILSECTIONS,
    FILTER_BY_REGION,
    GET_ADMIN,
    SUBMIT_MODIF,
    SUBMIT_CREATE,
    SUBMIT_DELETE,
    SUBMIT_DELETE_LOCATION,
    SUBMIT_PROFILE_MODIF,
    ORDER_BY
} from "../Actions/admin_actions.js"
import { PAGINATE_ADMIN } from "../Actions/pagination_actions.jsx"
import { RESET_STATE } from "../Actions/login_actions.jsx"

const initialState = {
    isLoading: false,
    error: false,
    profile: null,
    trailsections: null,
    trails: null,
    locations: null,
    admins: null,
}

const comparators = {
    ['ASC'](a, b) {
        return a - b
    },
    ['DESC'](a, b) {
        return b - a
    }
}

export function admin_user_reducer(state = initialState, action = null) {
    state = Immutable.fromJS(state)
    switch (action.type) {
        case SET_USER:
            return state
                .set('profile', action.user)
                .toJS()
        case RESET_STATE:
            return initialState
        case SUBMIT_PROFILE_MODIF.REQUEST:
        case SUBMIT_CREATE.REQUEST:
        case SUBMIT_MODIF.REQUEST:
        case SUBMIT_DELETE.REQUEST:
        case SUBMIT_DELETE_LOCATION.REQUEST:
        case PAGINATE_ADMIN.REQUEST:
        case FILTER_BY_REGION.REQUEST:
        case USER_TRAILS.REQUEST:
        case USER_LOCATIONS.REQUEST:
        case USER_TRAILSECTIONS.REQUEST:
        case GET_ADMIN.REQUEST:
            return state
                .set('isLoading', true)
                .toJS()
        case PAGINATE_ADMIN.SUCCESS:
            return state
                .set('isLoading', true)
                .set("trails", action.data)
                .toJS()
        case FILTER_BY_REGION.SUCCESS:
        case USER_TRAILS.SUCCESS:
            return state
                .set('isLoading', false)
                .set("trails", action.trails)
                .toJS()
        case USER_LOCATIONS.SUCCESS:
            return state
                .set('isLoading', false)
                .set("locations", action.locations)
                .toJS()
        case USER_TRAILSECTIONS.SUCCESS:
            return state
                .set('isLoading', false)
                .set("trailsections", action.trailsections)
                .toJS()
        case GET_ADMIN.SUCCESS:
            return state
                .set('isLoading', false)
                .set("admins", action.admins)
                .toJS()
        case SUBMIT_CREATE.SUCCESS:
            {
                let { meta: { collection } } = action
                return state.setIn(
                        [collection],
                        state.getIn([collection]).push(action.payload)
                    )
                    .set('isLoading', false)
                    .toJS()
            }
        case SUBMIT_MODIF.SUCCESS:
            {
                let { meta: { collection } } = action
                // Find the index of the element we want to update (based on the key of the returning element)
                let index = state.getIn([collection]).findIndex(location => {
                        return location.get('id') === action.payload['id']
                    })
                    // Return the standard JS object
                return state.setIn(
                        [collection, index],
                        action.payload
                    )
                    .set('isLoading', false)
                    .toJS()
            }
        case SUBMIT_DELETE.SUCCESS:
            {
                let { meta: { collection } } = action
                let filtered_collection = state.getIn(
                    [collection]
                ).filterNot(item => item.get('id') === action.payload)

                return state.setIn(
                        [collection],
                        filtered_collection
                    )
                    .set('isLoading', false)
                    .toJS()

            }
        case SUBMIT_DELETE_LOCATION.SUCCESS:
            {
                let { meta: { collection }, payload } = action
                let index = state.getIn(
                    [collection]
                ).findIndex(location => {
                    return location.get('id') === payload['id']
                })
                return state.setIn(
                    [collection, index],
                    payload
                ).toJS()
            }
        case SUBMIT_PROFILE_MODIF.SUCCESS:
            return state.set('profile', action.payload).toJS()
        case SUBMIT_PROFILE_MODIF.FAILURE:
        case SUBMIT_DELETE.FAILURE:
        case SUBMIT_DELETE_LOCATION.FAILURE:
        case SUBMIT_MODIF.FAILURE:
        case PAGINATE_ADMIN.FAILURE:
        case FILTER_BY_REGION.FAILURE:
        case USER_TRAILS.FAILURE:
        case USER_LOCATIONS.FAILURE:
        case USER_TRAILSECTIONS.FAILURE:
        case GET_ADMIN.FAILURE:
            return state
                .set('isLoading', false)
                .set("error", true)
                .toJS()
        default:
            return state.toJS()
        case ORDER_BY:
            {
                let {meta: {collection, field}, payload} = action
                let comparator = comparators[payload]
                let sortedCollection = state.getIn([collection]).sortBy(v => new Date(v.get(field)), comparator)
                return state
                    .setIn([collection], sortedCollection)
                    .toJS()
            }
    }
}
