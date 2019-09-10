/**
 * Created by fbrousseau on 2016-04-08.
 *
 */
import axios from "axios"
import MobileDetect from "mobile-detect"

const md = new MobileDetect(window.navigator.userAgent);
const COOKIE_PATH = "userInfo";
const SITE_PATH = "/";
const API_ROOT = "{{ api_root }}";
const mapServer = "{{ map_server }}";
const mapService = "{{ map_service }}";
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
