/**
 * Created by fbrousseau on 2016-03-02.
 */

/**
* [YB 2016-06-07: Note about the "import" statement, which babel tranpiles to CommonJS require() calls]
* If the module identifier passed to require() is not a native module, and does not
* begin with '/', '../', or './', then Node.js starts at the parent directory of the
* current module, and adds /node_modules, and attempts to load the module from that location.
*/

import DocReady from "es6-docready"

// IE does not support Object.assign, so we need to polyfill
import "babel-polyfill"

//Dependencies
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {Router, Route, Redirect, IndexRoute, browserHistory, hashHistory} from "react-router"
import {syncHistoryWithStore} from "react-router-redux"

//Redux store
import store from "./Store/store.jsx"

//HHC
import Authorize from  "./HHC/authenticateComponent.jsx"
import {checkIfOwner} from "./HHC//authUtilities.js"

//Views
import App from "./Containers/app_container.jsx"
import AboutContainer from "./Containers/about_container.jsx"
import AdminLoginContainer from './Containers/admin_login_container.jsx'
import FaqContainer from "./Containers/faq_container.jsx"
import HikeContainer from "./Containers/hike_container.jsx"
import HomeContainer from "./Containers/home_container.jsx"
import NetworkContainer from "./Containers/network_container.jsx"
import AdminPanelContainer from "./Containers/admin_panel_container.jsx"
import RegisterContainer from "./Containers/register_container.jsx"
import ResultsContainer from "./Containers/results_container.jsx"
import TocContainer from "./Containers/toc_container.jsx"
import {PoiContainer} from "./Containers/poi_container.jsx"
import TrailSectionFormContainer from "./Containers/trailsectionFormContainer.jsx"

import {ErrorPage} from "./Components/basic_components/errorPage.jsx"
import {contestPage} from "./Components/basic_components/contestPage.jsx"

import {SITE_PATH} from "./config.jsx"

const history = syncHistoryWithStore(browserHistory, store)

// The Provider makes the store available to ALL container components without having to pass it explicitely. All react container components need access to the redux store so they can connect to it.
DocReady(() => {
    var requireAuth = (store, nextState, replace) => {
      store.dispatch(checkAuth())
    }

    ReactDOM.render(
        <Provider store={store}>
            <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
                <Route path={SITE_PATH} component={App}>
                    <IndexRoute component={HomeContainer}/>
                    <Route path="/results" component={ResultsContainer}/>
                    <Route path="/register" component={RegisterContainer}/>
                    <Route path="/hikes/:hikeId" component={HikeContainer}/>
                    <Route path="/point-of-interests/:poiId" component={PoiContainer}/>
                    <Route path="/locations/:locationId" component={NetworkContainer}/>
                    <Route path="/admin/login" component={AdminLoginContainer}/>
                    <Redirect from="/admin" to="/admin/login"/>
                    <Route path="/admin/:username"
                        component={
                            Authorize({
                                checkIfOwner: checkIfOwner
                            })(AdminPanelContainer)
                        }/>
                        <Route path="/admin/:username/trailsections/:trailsectionId" component={TrailSectionFormContainer}/>
                        <Route path="/admin/:username/:locationId/createnewtrailsection" component={TrailSectionFormContainer}/>
                    <Route path="/faq" component={FaqContainer}/>
                    <Route path="/about" component={AboutContainer}/>
                    <Route path="/toc" component={TocContainer}/>
                    <Route path='/concours' component={contestPage}/>
                    <Route path='*' component={ErrorPage}/>
                </Route>
            </Router>
        </Provider>, document.querySelector("#app"))
    }
)
