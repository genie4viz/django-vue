/**
 * Created by fbrousseau on 2016-04-08.
 */
import axios from "axios"
import MobileDetect from "mobile-detect"

/*
 * These configuration variables are here for development only, when installing
 * on the server, the config.jsx file is installed from the svr_* roles
 */
const md = new MobileDetect(window.navigator.userAgent);
const COOKIE_PATH = "userInfo";
const SITE_PATH = "/";
const API_ROOT = "http://api.dev.hikster.com";
const mapServer = "https://hiksterarcgis.goazimut.com/arcgis/rest/services/";
const mapService = "Hikster_New_Schema_Test";
const apiVersion = "2.0";

axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = `application/json; version=${apiVersion}`;

export {
    SITE_PATH,
    COOKIE_PATH,
    API_ROOT,
    mapServer,
    mapService,
    md
}
