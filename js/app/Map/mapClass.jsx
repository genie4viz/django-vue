
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import { push } from "react-router-redux";

//Redux store
import store from "../Store/store.jsx";

import { mapServer, mapService, API_ROOT, SITE_PATH } from "../config.jsx";
import axios from "axios";

import cloneLayer from "leaflet-clonelayer";

import {selectHikeFromList} from "../Actions/actions.jsx";

import {Observable} from "../Utils/misc.js";
import * as Actions from "../Constants/constants.jsx";

import {Sport} from "../Reducers/reducers.js";

/**
* Zoom level table
* Level    Degree     Area            m / pixel        ~Scale                   Hikster scale  Hikster layers
* 0        360        whole world     156,412          1:500 million            X              Tiles
* 1        180                        78,206           1:250 million            X              Tiles
* 2        90                         39,103           1:150 million            X              Tiles
* 3        45                         19,551           1:70 million             1000km         Tiles
* 4        22.5                       9,776            1:35 million             500km          Tiles
* 5        11.25                      4,888            1:15 million             300km          Tiles
* 6        5.625                      2,444            1:10 million             100km          Tiles
* 7        2.813                      1,222            1:4 million              50km           Tiles
* 8        1.406                        610.984        1:2 million              30km           Tiles
* 9        0.703     wide area          305.492        1:1 million              20km           Tiles
* 10       0.352                        152.746        1:500,000                10km           Tiles
* 11       0.176     area                76.373        1:250,000                5km            Tiles
* 12       0.088                         38.187        1:150,000                2km            Tiles
* 13       0.044     village/town        19.093        1:70,000                 1km            Tiles
* 14       0.022                          9.547        1:35,000                 500m           Tiles
* 15       0.011                          4.773        1:15,000                 300m           Tiles
* 16       0.005     small road           2.387        1:8,000                  100m           Client
* 17       0.003                          1.193        1:4,000                  50m            Client
* 18       0.001                          0.596        1:2,000                  X              X
* 19       0.0005                         0.298        1:1,000                  X              X
*/

const mapStateToProps = (state) => {
    return {
        search: state.search,
        selected: state.selected,
        highlighted: state.highlighted,
        hike: state.hikeDetails,
        network: state.network,
        legend: state.legend,
        ui: state.ui
    }
};

export class MapHikster extends Component {

    static propTypes = {
        search: PropTypes.object,
        selected: PropTypes.object,
        highlighted: PropTypes.object,
        hike: PropTypes.object,
        location: PropTypes.object,
        network: PropTypes.object,
        legend: PropTypes.object,
        ui: PropTypes.object
    };

    static LIGHT_GREEN = "#5e9c35"; // RGB 94,156,53
    static DARK_GREEN = "#4e822c";  // RGB 78,130,44
    static BLACK_GREEN = "#345D26"; // RGB 52,93,38
    static GREY = "#8e8e8e";        // RGB 142, 142, 142
    static RED = "#ff0000";
    static BLUE = "#3388ff";
    static WHITE = "#ffffff";
    static CLAIRE_LIGHT_GREEN = "#ace268"; // RGB 172,226,104
    static ORANGE = "#f18f01"; // RGB 241,143,1

    // MAP SERVICE LAYERS
    static LAYER_POI = 0;
    static LAYER_TRAIL_SECTION = 1;            // No longer used here but still in map service for AppCom
    static LAYER_INCOMPLETE_TRAIL_SECTION = 2; // No longer used here but still in map service for AppCom
    static LAYER_NETWORK = 3;
    static LAYER_REGION = 4;
    static LAYER_TRAIL = 5;
    static LAYER_INCOMPLETE_TRAIL = 6;

    static ZOOM_FITBOUNDS = 0;
    static ZOOM_FLYTO = 1;

    constructor(props) {
        super(props);

        this.map = null;
        this.routing = null;

        this.layerSelection = [];

        // Trail section layer + styles
        this.defaultTrailStyle = { color: MapHikster.BLACK_GREEN, weight: 3, opacity: 1 };
        this.resultTrailStyle = { color: MapHikster.BLACK_GREEN, weight: 3, opacity: 1 };
        this.selectedTrailStyle = { color: MapHikster.BLACK_GREEN, weight: 3, opacity: 1 };
        this.highlightHaloTrailStyle = { color: MapHikster.ORANGE, weight: 7, opacity: 1};
        this.selectHaloTrailStyle = { color: MapHikster.ORANGE, weight: 7, opacity: 1};
        this.selectHaloTrailStyleHidden = { color: MapHikster.WHITE, weight: 7, opacity: 0};
        this.resultHaloTrailStyle = { color: MapHikster.CLAIRE_LIGHT_GREEN, weight: 7, opacity: 1};

        this.regionPolygonStyle = { color: '#fff', weight: 1, opacity: 1.0, fill: true, fillColor: '#fff', fillOpacity: 0.0 }; // Fill is required for mouseover/mouseout to work properly, even if fill transparent
        this.highlightRegionPolygonStyle = { color: '#fff', weight: 1, opacity: 1.0, fill: true, fillColor: '#fff', fillOpacity: 0.6 };

        // Trail section layer (incomplete) + styles
        this.incompleteMarkers = null;

        // Point of interest layer + symbols
        this.pointOfInterestLayer = null;
        this.poiClusterGroup = null;
        this.poiCategories = { 0: 'default', 1: 'hebergement', 3: 'stationnement', 4: 'activite', 5: 'restaurant', 6: 'autre' };

        // Network layer
        this.networkLayer = null;

        // Region layer
        this.regionFeatureLayer = null;

        // Default configuration
        this.config = {
            basemap: "Topographic",
            elevation: false,
            scale: true,
            delormeBasemap: false,
            scrollWheelZoom: true,
            showRegionLayer: false
        }

        // Highlight timer
        this.timer = null;

        // Trail difficulty
        this.formattedDifficulty = {
            1: "Débutant",
            2: "Modéré",
            3: "Intermédiaire",
            4: "Soutenu",
            5: "Exigeant"
        }

        this._handleHikeClick = this._handleHikeClick.bind(this);
        this._handleHighlight = this._handleHighlight.bind(this);
        this._handleHighlightOff = this._handleHighlightOff.bind(this);
    }

    /**
    * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
    * At this point in the lifecycle, you can access any refs to your children (e.g., to access the underlying DOM representation).
    */
    componentDidMount() {
        // Add listeners for zooming
        Observable.addListener(Actions.ZOOM_TO_HIKE, this._handleHikeClick);
        Observable.addListener(Actions.HIGHLIGHT_HIKE, this._handleHighlight);
        Observable.addListener(Actions.HIGHLIGHT_HIKE_OFF, this._handleHighlightOff);

        // Results page map
        if (this.props.location.pathname.indexOf("results") !== -1){
            this.initMap({
                domNode: "map",
                delormeBasemap: true,
                showRegionLayer: true // Crop the map if the side panel is opened
            });
            this.displayResults({ results: this.props.search, callback: () => {
                // If there's already a selected trail, select it in the map
                if (this.props.selected && this.props.selected.selectedHike.object_type === "Trail" && this.props.selected.selectedHike.id){
                    this.selectTrails({ trailLayers: [this.trailToGeoJSON(this.props.selected.selectedHike)], zoomType: MapHikster.ZOOM_FITBOUNDS });
                }
                // If there's already a selected trail network, select it in the map
                //else if (this.props.network.data){
                //  this.selectNetwork(this.props.network);
                //}
                // No previous selection, so just zoom the results
                else if (this.props.location.pathname.indexOf('results') !== -1){
                    this.zoomResults();
                }
            } });
        }
        // Hike Details page map
        else if (this.props.location.pathname.indexOf('hikes') !== -1) {
            this.initMap({
                domNode: "map",
                delormeBasemap: true,
                elevation: false,
                scrollWheelZoom: false,
                sport: this.props.hike.data.activity  // Override the sport filter of the Legend
            });

            // We show the trail from the page's data we are at right now
            if (this.props.hike.data.object_type === "Trail" && this.props.hike.data.id && this.props.hike.data.shape) {

                this.selectTrails({ trailLayers: [this.trailToGeoJSON(this.props.hike.data)], zoomType: MapHikster.ZOOM_FITBOUNDS });
            }
        }
        // Network Details page map
        else if (this.props.location.pathname.indexOf('location') !== -1){
            this.selectHaloTrailStyle = { color: MapHikster.CLAIRE_LIGHT_GREEN, weight: 7, opacity: 1};
            this.initMap({
                domNode: "map",
                delormeBasemap: true,
                elevation: false,
                scrollWheelZoom: false
            });

            // If there's already a selected trail network, select it in the map
            if (this.props.network.details){
                this.selectNetwork(this.props.network);
            }
        } else if (this.props.location.pathname.indexOf("point-of-interests") !== -1) {
            // Init map for POI
            this.initMap({
                domNode: "map",
                delormeBasemap: true,
                elevation: false,
                scrollWheelZoom: false
            });

            if(this.props.poiDetails.data) {

                this.resultLayers.addData(this.props.poiDetails.data.shape)
                this.zoomResults()
            }

            /* Get user location and init routing async
            navigator.geolocation.getCurrentPosition(location => {
                const {latitude, longitude} = location.coords

                this.routing = L.Routing.control({
                    waypoints: [
                        L.latLng([latitude, longitude]),
                        L.latLng(...poiCoordinates)
                    ],
                    lineOptions: {
                    styles: [
                        {color: 'white', opacity: 0.8, weight: 12},
                        {color: '#7ec450', opacity: 1, weight: 6}
                        ]
                    },
                    router: L.Routing.mapbox('mapbox-pk.eyJ1IjoiY2xhaXJlZGVndWVsbGUiLCJhIjoiY2ozazVraGkzMDB4NTJ3cXQ2NXd4YjZrYiJ9.aeR6EKn38zvZTvCVMgTdDA', {costing: 'auto'}),
                    formatter: new L.Routing.mapzenFormatter(),
                    routeWhileDragging: false
                }).addTo(this.map)
            })
            */
        }
    }

    /**
    * Invoked before rendering when new props or state are being received.
    * This method is not called for the initial render or when forceUpdate is used.
    * Use this as an opportunity to return false when you're certain that the transition
    * to the new props and state will not require a component update.*/
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.search.trail.isLoading == true && nextProps.search.trail.isLoading == false && nextProps.search.trail.error == false){
            this.displayResults({ results: nextProps.search, callback: () => {
                this.zoomResults({ flyTo: true });
            } });
        }
        else if (this.props.legend.sport !== nextProps.legend.sport){

            this.updateTrailLayer({ sport: nextProps.legend.sport });
            this.updateIncompleteTrails({ sport: nextProps.legend.sport });
        }
        else if (this.props.legend.poiVisibility !== nextProps.legend.poiVisibility){
            this.updatePOIClusters({ poiVisibility: nextProps.legend.poiVisibility });
        }
        // else if (this.props.ui.get("side-panel").get("isVisible") !== nextProps.ui.get("side-panel").get("isVisible")){
        //     setTimeout(() => {
        //         this._toggleClass('map', 'slide-panel-opened', nextProps.ui.get("side-panel").get("isVisible"));
        //         this.map.invalidateSize();
        //     }, nextProps.ui.get("side-panel").get("isVisible") ? 250 : 0);
        // }
        /*else if (nextProps.selected.selectedHike.object_type === 'Trail'){
            if (this.props.selected.selectedHike.object_type !== 'Trail' || nextProps.selected.selectedHike.id !== this.props.selected.selectedHike.id){
                this.selectTrails({ trailLayers: [this.trailToGeoJSON(nextProps.selected.selectedHike)] });
            }
            else {
                this.map.fitBounds(this.selectionLayers.getBounds().pad(0.25));
            }
        }*/
        // else if (nextProps.selected.selectedHike.object_type === 'Location'){
        //     if (this.props.selected.selectedHike.object_type !== 'Location' || nextProps.selected.selectedHike.location_id !== this.props.selected.selectedHike.location_id){
        //         this.selectNetwork(nextProps.selected.selectedHike);
        //     }
        //     else {
        //         this.map.fitBounds(this.selectionLayers.getBounds().pad(0.25));
        //     }
        // }

        return false; // Never re-render map
    }

    componentWillUnmount() {
        Observable.removeListener(Actions.ZOOM_TO_HIKE, this._handleHikeClick);
        Observable.removeListener(Actions.HIGHLIGHT_HIKE, this._handleHighlight);
        Observable.removeListener(Actions.HIGHLIGHT_HIKE_OFF, this._handleHighlightOff);

    }

    //==============================================================================
    //================================= MAP ========================================
    //==============================================================================

    /**
    * Inits the map with the specified config
    * @param {Object} config Map configuration
    *   domNode {HTMLElement|String} Map container
    *   basemap? {String} ESRI basemap to use. Default: Topographic
    *   elevation? {Boolean} Loads the elevation plugin. Default: false
    *   scale? {Boolean} Displays the scale. Default: true
    *   scrollWheelZoom? {Boolean} Whether the map can be zoomed by using the mouse wheel. Default: true
    *   delormeBasemap {Boolean} Displays the DeLorme basemap at high scales. Default: false
    */
    initMap(config) {

        Object.assign(this.config, config);

        // Create the map

        this.map = L.map(this.config.domNode, {
            center: [50.13466432216696, -72.72949218750001],
            zoom: 6,
            zoomControl: false,
            zoomAnimation: true,
            minZoom: 3,
            maxZoom: 17,
            scrollWheelZoom: this.config.scrollWheelZoom
        });

        L.Control.zoomHome({ position: 'topright', parent: this }).addTo(this.map);

        // Enable mouse wheel zooming after the map has focus
        //this.map.once('focus', () => { this.map.scrollWheelZoom.enable(); });

        // ====== mapbox ======
        let tileFormat = '';
        var MapBox = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}' + tileFormat + '?access_token=pk.eyJ1IjoiY2xhaXJlZGVndWVsbGUiLCJhIjoiY2ozazVraGkzMDB4NTJ3cXQ2NXd4YjZrYiJ9.aeR6EKn38zvZTvCVMgTdDA', {
        	attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        // Trails tile layers (1 per sport + 1 for all sports combined)
        this.tileLayers = [];
        this.addTileLayer(Sport.RANDONNEE);
        this.addTileLayer(Sport.RAQUETTE);
        this.addTileLayer(Sport.RANDONNEE_HIVERNALE);
        this.addTileLayer(Sport.VELO_DE_MONTAGNE);
        this.addTileLayer(Sport.FATBIKE);
        this.addTileLayer(Sport.VELO);
        this.addTileLayer(Sport.SKI_DE_FOND);
        this.addTileLayer(Sport.EQUITATION);
        this.addTileLayer(Sport.ALL);

        // Display trail sections
        this.updateTrailLayer({ sport: this.config.sport || this.props.legend.sport });

        this.incompleteIcon50 = L.icon({ iconSize: [9, 10], iconAnchor: [4, 10], iconUrl: "/static/img/markers/incomplete_pin_50.png" });
        this.incompleteIcon50Hover = L.icon({ iconSize: [9, 10], iconAnchor: [4, 10], iconUrl: "/static/img/markers/incomplete_pin_50_hover.png" });
        this.incompleteIcon100 = L.icon({ iconSize: [5, 5], iconAnchor: [2, 2], iconUrl: "/static/img/markers/incomplete_pin_100.png" });
        this.incompleteIcon100Hover = L.icon({ iconSize: [5, 5], iconAnchor: [2, 2], iconUrl: "/static/img/markers/incomplete_pin_100_hover.png" });

        // Add incomplete later for incomplete trail sections
        this.updateIncompleteTrails({ sport: this.config.sport || this.props.legend.sport });

        // Add FeatureLayer for the Regions
        this.updateRegionLayer();

        // Map event handlers
        this.map.on('click', (e) => { this.onMapClick(e); });

        this.map.on('zoomstart', (e) => {
            this._toggleLayer(this.poiClusterGroup, false);
        });

        this.map.on('dragstart', (e) => {

        });

        this.map.on('zoomend', (e) => {
            clearTimeout(this.refreshAllTheThings);
            this.refreshAllTheThings = setTimeout((e) => {
                this.updatePOIClusters({ poiVisibility: this.props.legend.poiVisibility });
                this.updateIncompleteTrails({ sport: this.config.sport || this.props.legend.sport });
                this.updateTrailLayer({ sport: this.config.sport || this.props.legend.sport });
            }, 2000);

            this.map.attributionControl._container.innerHTML = this.attribution + " | " + this.map.getZoom();

            if (this.latestRegionMouseOver && this.map.getZoom() > 7){
                this.latestRegionMouseOver.setStyle(this.regionPolygonStyle);
                this.latestRegionMouseOver = null;
            }

            // Restore opacity to the overlay pane after a flyTo
            L.DomUtil.setOpacity(document.getElementsByClassName('leaflet-overlay-pane')[0], 1);

        });

        this.map.on('dragend', (e) => {
            clearTimeout(this.refreshAllTheThings);
            this.refreshAllTheThings = setTimeout((e) => {
                this.updatePOIClusters({ poiVisibility: this.props.legend.poiVisibility });
                this.updateIncompleteTrails({ sport: this.config.sport || this.props.legend.sport });
                this.updateTrailLayer({ sport: this.config.sport || this.props.legend.sport });
            }, 2000);
        });

        if (this.config.scale){
            L.control.scale({ imperial: false, position: 'topright' }).addTo(this.map);
        }

        this.resultLayers = L.geoJson().addTo(this.map);
        this.selectionLayers = L.geoJson().addTo(this.map);
        this.highlightLayers = L.geoJson().addTo(this.map);

        this.attribution = this.map.attributionControl._container.innerHTML;
        this.map.attributionControl._container.innerHTML = this.attribution + " | " + this.map.getZoom();

        // Elevation plugin test
        if (this.config.elevation){
            this.el = L.control.elevation({
                position: "topright",
                theme: "hikster-theme", //default: lime-theme
                width: 600,
                height: 125,
                margins: { top: 10, right: 20, bottom: 30, left: 50 },
                useHeightIndicator: false, //if false a marker is drawn at map position
                interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
                hoverNumber: {
                    decimalsX: 3, //decimals on distance (always in km)
                    decimalsY: 0, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)
                    formatter: undefined //custom formatter function may be injected
                },
                xTicks: undefined, //number of ticks in x axis, calculated by default according to width
                yTicks: undefined, //number of ticks on y axis, calculated by default according to height
                collapsed: false,  //collapsed mode, show chart on click or mouseover
                imperial: false    //display imperial units instead of metric
            });
            this.el.addTo(this.map);
        }
    }

    addTileLayer = (activity_id) => {
        // Extent with tiles (you will get 404 errors if you request tiles outside this) - Check properties of Layer in .mxd, adjust extent values here if it changed
        let bounds = L.latLngBounds(L.latLng(45.006416, -79.512542), L.latLng(61.302801, -57.161299));

        this.tileLayers.push(new L.tileLayer(mapServer + "Hikster_New_Schema_Test_Tiles_Activity" + activity_id + "/MapServer/tile/{z}/{y}/{x}", {
            activity_id: activity_id,
            minZoom: 0,
            maxZoom: 15,
            bounds: bounds,   // If set, tiles will only be loaded inside the set LatLngBounds
            updateWhenZooming: false,
            keepBuffer: 20     // When panning the map, keep this many rows and columns of tiles before unloading them
        }));
    }

    onMapClick = (e) => {

        // Spatial query to find features located nearby the mouse click
        var query = L.esri.query({ url: mapServer + mapService + "/MapServer/" + MapHikster.LAYER_TRAIL, useCors: false });
        query.nearby(e.latlng, this.getDistanceByZoomLevel());
        query.fields('activity_id,description,difficulty,trail_id,name,shape,total_length');
        query.run((error, featureCollection, response) => { // This returns the features in GeoJSON FeatureCollection format
            if (!error){
                if (featureCollection.features.length > 0){

                    // Get extra info about these trails from the API (e.g. Park information) -- info which is not available directly in the map service layer
                    let featureIds = [];
                    for(let feature of featureCollection.features){
                        featureIds.push(feature.properties.trail_id);
                    }
                    axios.get(API_ROOT + "/trails/", {
                        params: {
                            ids: featureIds.toString(),
                            include: "trail_id,location,name,location_id",
                            expand: "location"
                        },
                        responseType: "json",
                        timeout: 20000
                    })
                    .then((response) => {
                        // Create a leaflet L.geoJSON from the GeoJSON FeatureCollection -- it will contain an array of L.geoJSON (1 per trail)
                        let trailLayers = L.geoJSON();

                        // Append the extra info to each trail in the feature collection
                        for(let data of response.data.results){
                            for(let feature of featureCollection.features){
                                if (data.trail_id === feature.properties.trail_id){
                                    Object.assign(feature.properties, data);

                                    trailLayers.addLayer(L.geoJSON(feature));
                                }
                            }
                        }

                        // Display the trails in the map, as a new "Selection" of trails
                        this.selectTrails({ trailLayers: trailLayers.getLayers() });
                    });
                }
            }
            else {
                console.log(error);
            }
        });

    }

    //==============================================================================
    //=============================== TRAILS =======================================
    //==============================================================================

    /**
    * Renders the trails on the map
    * @param {Object} params
    *   sport {Sport} Indicates which sport(s) are enabled (there can be more then one at the same time)
    */
    updateTrailLayer(params){
        let sport = params.sport;

        // Remove client-side layer
        this._toggleLayer(this.trailClientLayer, false);

        // Render tile layers for lower zoom levels. Render a client-side layer for the highest levels (i.e. no tiles available)
        if (this.map.getZoom() <= 15){
            for(let tileLayer of this.tileLayers){
                this._toggleLayer(tileLayer, sport === tileLayer.options.activity_id);
            }
        } else {
            let where = null;
            switch(sport){
                case Sport.NONE:  where = "activity_id = 0";         break;
                case Sport.ALL:   where = "activity_id > 0";         break;
                default:          where = "activity_id = " + sport;

            }

            let query = L.esri.query({ url: mapServer + mapService + "/MapServer/" + MapHikster.LAYER_TRAIL, useCors: true });
            query.intersects(this.map.getBounds());
            query.where(where);
            query.run((error, featureCollection, response) => {
                let trailClientLayer = L.geoJson(featureCollection, {
                    style: this.defaultTrailStyle,
                    onEachFeature: (feature, layer) => {
                        layer.on('mouseover', (e) => {
                            if (e.target._map.getZoom() >= 16){ // L.esri.featureLayer bug? Sometimes this is called when zoom is outside min/max zoom bounds
                                e.target.setStyle(this.highlightHaloTrailStyle);
                            }
                        });
                        layer.on('mouseout', (e) => {
                            e.target.setStyle(this.defaultTrailStyle);
                        });
                        layer.on('click', (e) => {
                            if (e.target._map.getZoom() >= 16){
                                console.log('Trail clicked');
                                // [YB 2016-12-08: We can't do anything here. We must do a spatial query and get ALL the trails at the point clicked in the map. see onMapClick]
                            }
                        })
                    }
                });

                this.trailClientLayer = trailClientLayer;
                this.map.addLayer(this.trailClientLayer);
            });
        }
    }

    /**
    * Renders the results (i.e. trails) on the map using a client-side layer
    * @param {Object} params
    *   results {Object} Trails from the API
    *   callback? {Function} Function to call after rendering is complete
    */
    displayResults(params){
        let results = params.results;

        this.resultLayers.clearLayers();

        // Display individual trails
        let trails = results.trail.data && results.trail.data.results ? results.trail.data.results.filter(trail => trail.shape !== null) : [];
        for(let trail of trails){
            let convertedTrail = this.trailToGeoJSON(trail);
            convertedTrail.setStyle(this.resultTrailStyle);

            let haloClone = cloneLayer(convertedTrail);
            haloClone.setStyle(this.resultHaloTrailStyle);
            this.resultLayers.addLayer(haloClone);
            this.resultLayers.addLayer(convertedTrail);

            convertedTrail.bringToFront();
        }

        if (params.callback){
            params.callback();
        }
    }

    /**
    * Zooms to bounds that contain all the results
    * @param {Object} params
    *   flyTo? {Boolean} Zoom animation mode
    */
    zoomResults(params){
        if (this.resultLayers.getLayers().length > 0){
            if (params && params.hasOwnProperty('flyTo') && params.flyTo){
                this._flyToBounds(this.resultLayers.getBounds().pad(0.25), {animate: true});
            }
            else {
                this.map.fitBounds(this.resultLayers.getBounds().pad(0.25), {animate: true});
            }
        }
    }

    /**
    * Renders the selected trail(s) using a client-side layer
    * @param {Object} params
    *   trailLayers {Layer[]} ex: L.geoJSON().getLayers() or [L.geoJSON]
    *   latlng? {L.latLng} Highest latitude in the trail(s)
    *   popup? {Boolean} Displays a popup of the trail(s) after selection
    *   zoomSelection? {Boolean} Zoom after selection
    *   zoomType? {Number} Type of zooming animation
    *   incomplete? {Boolean} Indicates that the trail(s) is incomplete (i.e. not displayed)
    */
    selectTrails(params){
        this.selectionLayers.clearLayers();
        this.highlightLayers.clearLayers();
        this.trailPopup = null;

        let trailLayers = params.trailLayers;

        if (trailLayers.length > 0){
            let latlng = params.latlng;
            let popup = params.hasOwnProperty('popup') ? params.popup : true;
            let zoomType = params.hasOwnProperty('zoomType') ? params.zoomType : MapHikster.ZOOM_FLYTO;

            // Display the selected trails
            this.selectedTrailStyle.opacity = params.hasOwnProperty('incomplete') ? 0 : 1;

            for(let trailLayer of trailLayers){
                let clone = cloneLayer(trailLayer);
                clone.data = trailLayer.data;
                clone.setStyle(this.selectedTrailStyle);
                clone.on('mouseover', (e) => { L.DomEvent.stopPropagation(e); clearTimeout(this.timer); this.highlightTrails({ trailLayers: [trailLayer] }) });

                let haloClone = cloneLayer(trailLayer);
                haloClone.setStyle(this.selectHaloTrailStyle);
                this.selectionLayers.addLayer(haloClone);

                this.selectionLayers.addLayer(clone);

                clone.bringToFront();
            }

            this.selectionLayers.on('click', this.onSelectionClick);

            // Zoom to the selected trails
            if ((this.map.getZoom() < 13 || this._overflowsBounds(this.selectionLayers)) && !(params.hasOwnProperty('zoomSelection') && params.zoomSelection === false)){
                switch(zoomType){
                    case MapHikster.ZOOM_FLYTO:     this._flyToBounds(this.selectionLayers.getBounds().pad(0.25), {animate: true});  break;
                    case MapHikster.ZOOM_FITBOUNDS: this.map.fitBounds(this.selectionLayers.getBounds().pad(0.25), {animate: true}); break;
                }
            }
            else {
                this.map.panTo(this.selectionLayers.getBounds().getCenter(), {animate: true, duration: 1});
            }

            // Display popup for each trail
            if (popup){
                for(let selectionLayer of this.selectionLayers.getLayers()){

                    if (selectionLayer.hasOwnProperty('data')){ // Only consider the true layers, not the halo layers

                        // For the popup coordinate, we use the highest latitude of the trail
                        if (!params.hasOwnProperty('incomplete')){
                            latlng = this.getTrailHighestCoord(selectionLayer);
                        }

                        let total_length = this.getFeatureProps(selectionLayer).total_length;
                        Object.assign(params, {
                            trail: this.getFeatureProps(selectionLayer),
                            latlng: latlng,
                            length: total_length >= 1000 ? (Math.round(total_length/1000 * 100) / 100) + " km" : (Math.round(total_length * 10) / 10) + " m"
                        });

                        this.trailPopup = this.popupTrail(params);
                    }
                }
            }

        }

    }

    /**
    * Displays a popup for the specified trail(s)
    * @param {Object} params
    *   offset? {Number} Alters the vertical position of the popup by this Y offset (in pixels)
    *   latlng? {L.latLng}
    */
    popupTrail(params){
        let offset = params.hasOwnProperty('offset') ? params.offset : 0;
        let latlng = params.latlng;
        let trail = params.hasOwnProperty('trail') ? params.trail : null;
        let length = params.length;

        let layer = params.hasOwnProperty('layer') ? params.layer : this.selectionLayers;
        let details = params.hasOwnProperty('details') ? params.details : true;

        let popup = L.popup({ offset: new L.point(0, offset), autoPan: false }).setLatLng(latlng);

        let name = trail ? trail.name : 'Sentier';
        let description = trail ? trail.description : null;
        let difficulty = trail ? trail.difficulty : null;
        let surface_type = trail ? trail.surface_type : null;

        let location = trail && trail.hasOwnProperty('location') ? trail.location : null;
        let locationId = location && location.hasOwnProperty('location_id') ? location.location_id : null;
        let locationName = location && location.hasOwnProperty('name') ? location.name : null;

        let hideTrail = params.hasOwnProperty('incomplete') && params.incomplete && this.map.getZoom() < 15;

        let content = "<div class='lf-popup trail'>" +
                        (Object.is(locationName, null) ? "" : (
                        "<div class='section network'>" +
                            "<div class='section-name'>Réseau:</div>" +
                            "<div class='section-values'>" +
                                "<div>" + locationName + "</div>" +
                                (details ? ("<a id='network-" + locationId + "' class='link network' href='" + window.location.origin + "/locations/" + locationId + "/' target='_blank'>Voir le détail</a>") : "") +
                            "</div>" +
                        "</div>")) +
                        (hideTrail ? "" : (
                        "<div class='section trail'>" +
                            (Object.is(locationName, null) ? "" : "<div class='section-name'>Sentier:</div>") +
                            "<div class='section-values'>" +
                                "<div>" + name + "</div>" +
                                (Object.is(length, null) ? "" : ("<div>" + length + "</div>")) +
                                (Object.is(difficulty, null) || difficulty < 1 || difficulty > 5 ? "" : ("<div>" + this.formattedDifficulty[difficulty] + "</div>")) +
                                ((!Object.is(trail, null) && details) ? ("<a id='details-" + trail.trail_id + "' class='link details' href='" + window.location.origin + "/hikes/" + trail.trail_id + "/' target='_blank'>Voir le détail</a>") : "") +
                            "</div>" +
                        "</div>")) +
                    "</div>";

        popup.setContent(content);
        layer.addLayer(popup);

        popup.id = trail ? trail.trail_id : null;
        return popup;
    }

    /**
    * Highlights a trail(s) when the user moves the mouse over it.
    * It does this by creating a duplicate (but larger) line behind the original trail(s)
    * @param {Object} params
    *   popup? {Boolean} Displays a popup of the trail(s) after the highlight
    */
    highlightTrails(params){
        let trailLayers = params.trailLayers;
        let popup = params.hasOwnProperty('popup') ? params.popup : true;

        this.highlightLayers.clearLayers();

        if (trailLayers){
            for(let trailLayer of trailLayers){
                let clone = cloneLayer(trailLayer);
                clone.setStyle(this.selectedTrailStyle);
                let haloClone = cloneLayer(trailLayer);
                haloClone.setStyle(this.highlightHaloTrailStyle);
                this.highlightLayers.addLayer(haloClone);
                this.highlightLayers.addLayer(clone);

                clone.bringToFront();

                // If the trail is not already selected, add a pop for quick info about the trail (but no details link)
                if (popup && (this.trailPopup === null || this.trailPopup === undefined || this.trailPopup.id !== this.getFeatureProps(trailLayer).id)){
                    let latlng = this.getTrailHighestCoord(trailLayer);
                    let total_length = this.getFeatureProps(trailLayer).total_length;
                    Object.assign(params, {
                        trail: this.getFeatureProps(trailLayer),
                        latlng: latlng,
                        layer: this.highlightLayers,
                        details: false,
                        length: total_length >= 1000 ? (Math.round(total_length/1000 * 100) / 100) + " km" : (Math.round(total_length * 10) / 10) + " m"
                    });

                    this.popupTrail(params);
                }

                clone.on('mouseout', (e) => { L.DomEvent.stopPropagation(e); clearTimeout(this.timer); this.timer = setTimeout(() => { this.highlightLayers.clearLayers(); }, 200) });
            }

        }
    }

    //==============================================================================
    //========================== INCOMPLETE TRAILS =================================
    //==============================================================================

    /**
    * The geometry of trails that haven't been created yet is just a short line
    * segment located at the trail park location. Until they are created, we
    * represent them in the map as green markers
    * @param {Object} params
    *   sport {Sport} Indicates which sport(s) are enabled (there can be more then one at the same time)
    */
    updateIncompleteTrails(params){
        let sport = params.sport;
        let zoomLevel = this.map.getZoom();

        // If the scale is 1:1 million or smaller, update the incomplete trails clusters
        if (sport !== Sport.NONE && zoomLevel >= 7){

            // Request incomplete trail geometry
            let query = L.esri.query({
                url: mapServer + mapService + "/MapServer/" + MapHikster.LAYER_INCOMPLETE_TRAIL,
                useCors: true
            });

            query.within(this.map.getBounds());

            // the current sport filter
            let where = null;
            switch(sport){
                case Sport.ALL:   where = "activity_id > 0";          break;
                default:          where = "activity_id = " + sport;   break;
            }
            query.where(where);

            query.run((error, featureCollection, response) => {

                let icon = zoomLevel >= 10 ? this.incompleteIcon50 : this.incompleteIcon100;
                let iconHover = zoomLevel >= 10 ? this.incompleteIcon50Hover : this.incompleteIcon100Hover;
                params.offset = zoomLevel >= 10 ? -6 : -2;
                let incompleteMarkers = L.featureGroup([]);

                if (featureCollection && featureCollection.features.length > 0){

                    // The geometries returned are polyline, not points.
                    // However to display the incomplete markers on the map, we need points.
                    // Use the first coord of the trail as the marker point.
                    for(let feature of featureCollection.features){

                        var pt = feature.geometry.type === "MultiLineString" ? feature.geometry.coordinates[0][0] : feature.geometry.coordinates[0];

                        // Create the marker
                        var marker = L.marker(L.latLng({ lat: pt[1], lng: pt[0]}), { feature: feature, icon: icon });
                        marker.on('click', (e) => { this.onIncompleteMarkerClick(e, params); });
                        marker.on('mouseover', (e) => { e.target.setIcon(iconHover); });
                        marker.on('mouseout', (e) => { e.target.setIcon(icon); });

                        incompleteMarkers.addLayer(marker);
                    }

                    this.map.addLayer(incompleteMarkers);
                    this._toggleLayer(this.incompleteMarkers, false);
                    this.incompleteMarkers = incompleteMarkers;


                    // If we are at a high zoom we want to see individual incomplete markers (that may be one on top of each other)
                    // We do this by clustering them and using the cluster spiderify function
                    this._toggleLayer(this.incompleteClusters, false);
                    if (zoomLevel >= 15){
                        this.incompleteClusters = L.markerClusterGroup({
                            spiderfyDistanceMultiplier: 3,
                            zoomToBoundsOnClick: false,
                            iconCreateFunction: (cluster) => { return icon; }
                        }).addTo(this.map);

                        this.incompleteClusters.addLayers(this.incompleteMarkers.getLayers());
                    }
                }
                else {
                    this._toggleLayer(this.incompleteMarkers, false);
                    this._toggleLayer(this.incompleteClusters, false);
                }
            });
        }
        else {
            this._toggleLayer(this.incompleteMarkers, false);
            this._toggleLayer(this.incompleteClusters, false);
        }
    }

    onIncompleteMarkerClick = (e, params) => {
        let feature = e.target.options.feature;

        // Get extra info about this trail from the API (e.g. Park information) -- info which is not available directly in the map service layer
        axios.get(API_ROOT + "/trails/" + feature.properties.trail_id, { // TODO check to use id alias instead to make it more straightforward
            params: {
                include: "id,location,name,location_id",
                expand: "location"
            },
            responseType: "json",
            timeout: 20000
        })
        .then((response) => {
            Object.assign(feature.properties, response.data);
            Object.assign(params, {
                trailLayers: [L.geoJSON(feature)],
                latlng: e.latlng,
                incomplete: true,
                zoomSelection: false
            });
            this.selectTrails(params);
        });
    }

    //==============================================================================
    //=============================== REGION =======================================
    //==============================================================================

    /**
    * Renders the tourism regions on the map using a client-side layer
    * Only for the lowest zoom levels (e.g. 50km+)
    */
    updateRegionLayer(){
        if (this.config.showRegionLayer && this.regionFeatureLayer === null){

            this.regionTooltips = {};

            let query = L.esri.query({url: mapServer + mapService + "/MapServer/" + MapHikster.LAYER_REGION, useCors: false });
            query.run((error, featureCollection, response) => {
                this.regionFeatureLayer = L.geoJson(featureCollection, {
                    style: this.regionPolygonStyle,
                    onEachFeature: (feature, layer) => {
                        layer.on('mouseover', (e) => {
                            this.latestRegionMouseOver = e.target;
                            if (e.target._map.getZoom() < 8){ // L.esri.featureLayer bug? Sometimes this is called when zoom is > then maxZoom
                                e.target.setStyle(this.highlightRegionPolygonStyle);
                                layer.tooltipTimeout = setTimeout(() => {
                                    e.target.bindTooltip(e.target.feature.properties.name);
                                    e.target.openTooltip();
                                }, 500);
                            }
                        });
                        layer.on('mouseout', (e) => {
                            e.target.setStyle(this.regionPolygonStyle);
                            clearTimeout(layer.tooltipTimeout);
                            e.target.closeTooltip();
                            e.target.unbindTooltip();
                        });
                        layer.on('click', (e) => {
                            if (e.target._map.getZoom() < 8){
                                e.target.setStyle(this.regionPolygonStyle);
                                this._flyToBounds(e.target.getBounds(), {animate: true});
                            }
                        })
                    }
                }).addTo(this.map);
            });
        }
    }

    //==============================================================================
    //========================== POINTS OF INTEREST ================================
    //==============================================================================

    updatePOIClusters(params){

        if (this.map.getZoom() >= 13){

            let poiVisibility = params.hasOwnProperty('poiVisibility') && params.poiVisibility ? params.poiVisibility : null;

            let query = L.esri.query({url: mapServer + mapService + "/MapServer/" + MapHikster.LAYER_POI, useCors: false });
            query.within(this.map.getBounds());
            if (!Object.is(poiVisibility, null)){
                query.where("type_id IN (" + poiVisibility + ")");
            }
            query.run((error, featureCollection, response) => {
                this.pointOfInterestLayer = L.geoJson(featureCollection, {
                    pointToLayer: (feature, latlng) => {
                        var poiType = feature.properties.type_id ? feature.properties.type_id : 0;

                        return L.marker(latlng, { icon: L.icon({
                            iconSize: [41, 41],
                            iconAnchor: [20, 41],  // Tip of the icon (geographical location) relative to it's top left corner
                            iconUrl: "/static/img/markers/Icones_Hikster_" + poiType + ".svg"
                        }) } );
                    }
                });
                this.pointOfInterestLayer.on('click', this.onPointOfInterestClick);

                this._toggleLayer(this.poiClusterGroup);

                this.poiClusterGroup = L.markerClusterGroup({
                    maxClusterRadius: 50,
                    spiderLegPolylineOptions: { weight: 1.5, color: '#7ec450', opacity: 1 },
                    spiderfyDistanceMultiplier: 2,
                    zoomToBoundsOnClick: false,
                    showCoverageOnHover: false,
                    spiderifyOnMaxZoom: false, // [YB 2016-11-14: Handle the spiderfy ourselves, at all zoom levels on clusterclick]
                    iconCreateFunction: (cluster) => {
                        return L.icon({
                            iconSize: [41, 41],
                            iconAnchor: [20, 41],  // Tip of the icon (geographical location) relative to it's top left corner
                            iconUrl: "/static/img/markers/Icones_Hikster_cluster.svg"
                        })
                    }
                });

                this.poiClusterGroup.on('clusterclick', (a) => {
                    a.layer.spiderfy();
                });

                // Bulk add all the POI to the cluster layer
                this.poiClusterGroup.addLayers(this.pointOfInterestLayer.getLayers());

                this.map.addLayer(this.poiClusterGroup);

                //[YB 2016-08-10: Warning: When using the Tangram map, for an unknown reason, the marker clusters won't display after a pan or a zoom. This is a workaround to force the clusters to display. This is not a fix, it's a workaround. It may break in future MarkerClusters versions.]
                setTimeout(() => { this.poiClusterGroup._moveEnd(); }, 0);
            });
        }
        else {
            this._toggleLayer(this.poiClusterGroup, false);
        }
    }

    onPointOfInterestClick = (e) => {
        let feature = e.layer.feature;

        // Request to get all the POI info from the API (including adress, contact, etc..)
        axios.get(API_ROOT + "/point-of-interests/" + feature.properties.objectid + "/?expand=type", {
            responseType: "json",
            timeout: 20000
        })
        .then((response) => {
            let poi = response.data;
            let poiId = poi.poi_id;
            let premium = poi.hasOwnProperty('premium') ? poi.premium : false;
            let name = poi.name ? poi.name : "";
            let category = poi.category ? poi.category : 0;
            let description = poi.description ? poi.description : null;
            let type = poi.type && poi.type.name ? poi.type.name : null;
            let position_quality = poi.hasOwnProperty('position_quality') ? poi.position_quality : null;

            let address = poi.address && poi.address[0] ? poi.address[0] : null; // [YB 2016/06/02: For now I won't handle multiple addresses. If there is really a request for it in the future we can implement it at that point]
            let address_first_line = address && (address.street_name || address.apartment) ? true : null;
            let address_second_line = address && address.po_box ? true : null;
            let address_third_line = address && (address.city || address.province || address.postal_code) ? true : null;

            // Generate contacts content
            let contacts = poi.contact && poi.contact.length > 0 ? poi.contact : null;
            let contactsContent = "";
            if (!Object.is(contacts, null)){
                contactsContent = "<div class='contacts'>";
                for(let contact of contacts){
                    switch(contact.type){
                        case "Téléphone": contactsContent += ("<a class='contact' href='tel:" + contact.value.replace(/[ -]/g, '.') + "'><div class='icon phone'></div>" + contact.value + "</a>"); break;
                        case "Courriel": contactsContent += ("<a class='contact' href='mailto:" + contact.value +"'><div class='icon email'></div>" + contact.value + "</a>"); break;
                    }
                }
                contactsContent += "</div>";
            }

            let popup = L.popup({ offset: new L.point(0, -36) }).setLatLng(e.latlng);

            popup.setContent("<div class='lf-popup poi'>" +
                "<div class='header'>" +
                    (Object.is(type, null) ? "" : ("<div class='type'>" + type + "</div>")) +
                    "<div class='text'>" + name + "</div>" +
                "</div>" +
                "<div class='content'>" +
                    (Object.is(description, null) ? "" : ("<div class='description'>" + description + "</div>")) +
                    (premium ? ("<a id='poi-" + poiId + "' class='link poi' href='" + window.location.origin + "/point-of-interests/" + poiId + "/' target='_blank'>Voir le détail</a>") : "") +
                    (Object.is(address, null) ? "" : ("<div class='address'>" +
                        (Object.is(address_first_line, null) ? "" : ("<div>" +
                            (Object.is(address.street_name, null) ? "" : address.street_name) +
                            (Object.is(address.apartment, null) ? "" : (", app. " + address.apartment)) +
                        "</div>")) +
                        (Object.is(address_second_line, null) ? "" : ("<div>" +
                            (Object.is(address.po_box, null) ? "" : address.po_box) +
                        "</div>")) +
                        (Object.is(address_third_line, null) ? "" : ("<div>" +
                            (Object.is(address.city, null) ? "" : address.city) +
                            (Object.is(address.province, null) ? "" : (" (" + address.province + ")")) +
                            (Object.is(address.postal_code, null) ? "" : (" " + address.postal_code)) +
                        "</div>")) +
                    "</div>")) +
                    contactsContent);

            this.map.addLayer(popup);
        });
    }

    //==============================================================================
    //=============================== NETWORK ======================================
    //==============================================================================

    selectNetwork(network){
        const trails = network.trails.filter(trail => trail.shape !== null)
        this.selectTrails({
            trailLayers: this.trailsToGeoJSON(trails).getLayers(),
            popup: false,
            zoomType: MapHikster.ZOOM_FITBOUNDS
        });
        //this.popupNetwork({ network: network });
    }

    popupNetwork(params){
        let network = params.network.data;
        let name = network.name;
        let network_length = network.hasOwnProperty('network_length') ? (network.network_length >= 1000 ? (Math.round(network.network_length/1000 * 100) / 100) + " km" : (Math.round(network.network_length * 10) / 10) + " m") : null;

        let maxLatlng = L.latLng(0, 0);
        for(let selectionLayer of this.selectionLayers.getLayers()){
            let latlng = this.getTrailHighestCoord(selectionLayer);
            if (latlng.lat > maxLatlng.lat){
                maxLatlng = latlng;
            }
        }

        let popup = L.popup({ offset: new L.point(0, 0) }).setLatLng(maxLatlng);

        let content = "<div class='lf-popup'>" +
                        "<div class='header'><div class='text'>" + name + "</div></div>" +
                        "<div class='content'>" +
                            (Object.is(network_length, null) ? "" : ("<div>" + network_length + "</div>")) +
                        "</div>" +
                        (Object.is(network, null) ? "" : ("<div id='details-" + network.location_id + "' class='details'>Détails</div>")) +
                    "</div>";

        popup.setContent(content);
        this.selectionLayers.addLayer(popup);

        // Create the click handler for the Details link
        if (Object.is(network, null) === false){
            document.querySelector("#details-" + network.location_id).onclick = (e) => {
                let id = e.target.id.replace('details-', "");
                store.dispatch(push('/location/' + id));
            }
        }

    }

    highlightNetwork(network){
        this.highlightLayers.clearLayers();

        axios.get(API_ROOT + "/locations/" + network.location_id + "/trails", {
            responseType: "json",
            timeout: 20000
        })
        .then((response) => {
            this.highlightTrails({ trailLayers: this.trailsToGeoJSON(response.data).getLayers(), popup: false });
        });
    }

    //==============================================================================
    //================================ UTIL ========================================
    //==============================================================================

    /**
    * Finds the highest latitude in a LineString or MultiLineString geometry object
    * @param {L.geoJSON} layer A trail layer
    * @return {L.latLng} Highest latitude
    */
    getTrailHighestCoord(layer){

        let getHighestCoord = (line, latlng) => {
            for(let coord of line){
                if (coord[1] > latlng.lat){
                    latlng = L.latLng({lat: coord[1], lng: coord[0]});
                }
            }
            return latlng;
        }

        let latlng = L.latLng(0, 0);
        let feature = layer.toGeoJSON().features[0];
        switch(feature.geometry.type){
            case 'LineString':
                let line = feature.geometry.coordinates;
                latlng = getHighestCoord(line, latlng);
                break;

            case 'MultiLineString':
                let lines = feature.geometry.coordinates;
                for(let line of lines){
                    latlng = getHighestCoord(line, latlng);
                }
                break;
        }
        return latlng;
    }

    getUrlParams(search) {
        let hashes = search.slice(search.indexOf('?') + 1).split('&')
        let params = {}
        hashes.map(hash => {
            let [key, val] = hash.split('=')
            params[key] = decodeURIComponent(val)
        })

        return params
    }

    /**
    * Finds the ideal distance a mouse click (projected onto the map) should be
    * from a trail to trigger a selection. Depends on the current zoom level.
    * @return {Number} distance (in meters)
    */
    getDistanceByZoomLevel(){
        var x = this.map.getZoom();
        var m = (200 - 20) / (10 - 16);
        var b = 20 - m*16;
        var y = m*x + b;
        if (y < 0) y = 5;
        return y;
    }

    /**
    * Takes a trail array from the API and outputs a new L.geoJSON layer of the trails
    * @param {Array} trails Array of trail objects from the API
    * @return {L.geoJSON} Layer that contains several other L.geoJSON layers of trail sections (one per trail)
    */
    trailsToGeoJSON(trails){
        let trailsLayer = L.geoJson();
        trailsLayer.layerType = 'Network';
        for(let trail of trails){
            trailsLayer.addLayer(this.trailToGeoJSON(trail));
        }
        return trailsLayer;
    }

    /**
    * Takes a trail object from the API and outputs a new L.geoJSON layer of the trail
    * @param {Object} trail Trail data from the API
    * @return {L.geoJSON} Trail Layer
    */
    trailToGeoJSON(trail){

        let trailLayer

        let geoJSON = {
            geometry: Object.assign({}, trail.shape),
            properties: Object.assign({}, trail),
            id: trail.trail_id,
            type: "Feature"
        };
        delete geoJSON.properties.shape;

        try {
          trailLayer = L.geoJson(geoJSON)
        } catch(e) {
          trailLayer = L.geoJson({
            geometry: {},
            properties: {},
            id: trail.id,
            type: "Feature"
          })
        }
        trailLayer.layerType = 'Trail';
        trailLayer.on('mouseover', (e) => { L.DomEvent.stopPropagation(e); clearTimeout(this.timer); this.highlightTrails({ trailLayers: [trailLayer] }) } );
        //trailLayer.on('mouseout', (e) => { L.DomEvent.stopPropagation(e); clearTimeout(timer); timer = setTimeout(() => { this.highlightLayers.clearLayers() }, 200) } );
        return trailLayer;
    }

    /**
    * Toggles the visibility of a layer on or off based on some true/false condition
    * Note: Leaflet disgracefully returns an error when the layer specified for
    * L.map.addLayer or L.map.removeLayer is null or undefined. This function
    * makes the proper checks and does nothing if the layer is invalid.
    * @param {L.Layer} layer The layer to toggle on or off
    * @param {Boolean} condition Condition for toggling the layer on or off
    */
    _toggleLayer(layer, condition){
        if (layer){
            if (condition && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if (!condition && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }
    }

    /**
    * Does a slow zoom animation to go from the current bonds to the next
    * @param {L.latLngBounds} bounds The new map bounds to fly to
    * @param {Object} options? Same as fitBounds options
    */
    _flyToBounds(bounds, options){
        // Some layers are kinda ugly when scaled during the flyTo animation. Hide them during the animation.
        this._toggleLayer(this.trailClientLayer, false);
        for(let tileLayer of this.tileLayers){
            this._toggleLayer(tileLayer, false);
        }
        this._toggleLayer(this.incompleteMarkers, false);

        // Some path layers bug out during the flyTo animation. Hide the entire overlay pane. This hides all path layers within the pane.
        L.DomUtil.setOpacity(document.getElementsByClassName('leaflet-overlay-pane')[0], 0);

        // Fly you fools
        this.map.flyToBounds(bounds, options);
    }

    /**
    * Finds out if the current layer fits in the map at the current zoom level
    * Confusion: Note that it doesn't check if the layer fits in the current extent, it checks if it would fit in the extent if it was at that location
    * @param {L.Layer} layer
    * @return {Boolean} True if the current layer wouldn't fit in the map at the current zoom level
    */
    _overflowsBounds(layer){
        return this.map.getBoundsZoom(layer.getBounds()) < this.map.getZoom();
    }

    _handleHikeClick(trail) {
        if (trail.shape) this.selectTrails({ trailLayers: [this.trailToGeoJSON(trail)] });
    }

    _handleHighlight(trail) {
        if (trail.shape) this.highlightTrails({ trailLayers: trail.trail_id ? [this.trailToGeoJSON(trail)] : null, popup: false });
    }

    _handleHighlightOff() {
        this.highlightLayers.clearLayers();
    }

    /**
    * Returns the properties object from a L.geoJSON layer (with only 1 feature)
    * @param {L.geoJSON} layer A leaflet GeoJSON layer
    * @return {Object} The feature properties object
    */
    getFeatureProps(layer){
        return layer.toGeoJSON().features[0].properties || null;
    }

    /**
    * Adds or removes class from htmlElement based on some condition
    * @param {String} el Id of the htmlElement
    * @param {String} className Name of class to add or remove
    * @param {Boolean} condition Removes class if false, Adds class if true
    */
    _toggleClass(el, className, condition){
        let htmlElement = document.getElementById(el);
        if (condition && !L.DomUtil.hasClass(htmlElement, className)){
            L.DomUtil.addClass(htmlElement, className);
        }
        else if (!condition && L.DomUtil.hasClass(htmlElement, className)){
            L.DomUtil.removeClass(htmlElement, className);
        }
    }

    render() {
        return (
            <div id="map" className="map"></div>
        )
    }
}


MapHikster = connect(mapStateToProps)(MapHikster)
