/**
 * Created by fbrousseau on 2016-03-10.
 */
import { createStore, applyMiddleware, combineReducers, compose } from "redux"
import { routerReducer, routerMiddleware } from "react-router-redux"
import { browserHistory } from "react-router"
import { reducer as formReducer } from "redux-form"
import { reducer as uiReducer } from "redux-ui"

import thunkMiddleware from "redux-thunk"
import authRequest from "../Middleware/authMiddleware.js"

import { reducer_authed } from "../Reducers/register_login_reducers.js"
import { reducer_showcase, reducer_search, reducers_selected, reducers_highlighted, reducer_legend } from "../Reducers/reducers.js"
import { reducer_hikeDetails } from "../Reducers/hike_details_reducer.js"
import { reducer_hikeNetworkDetails } from "../Reducers/network_details_reducer.js"
import { reducer_trailsectionDetails } from "../Reducers/trailsection_details_reducer.js"
import { reducer_poiDetails } from "../Reducers/poi_details_reducer.js"
import { notification_reducer } from "../Reducers/notificationReducer.js"
import { admin_user_reducer } from "../Reducers/admin_user_reducer.js"

const store = createStore(
    combineReducers({
        authed: reducer_authed,
        user: admin_user_reducer,
        showcase: reducer_showcase,
        search: reducer_search,
        //selected: reducers_selected,
        //highlighted: reducers_highlighted,
        legend: reducer_legend,
        trailsectionDetails: reducer_trailsectionDetails,
        hikeDetails: reducer_hikeDetails,
        poiDetails: reducer_poiDetails,
        network: reducer_hikeNetworkDetails,
        notifications: notification_reducer,
        form: formReducer,
        routing: routerReducer,
        ui: uiReducer,
    }), compose(
        applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)

export default store
