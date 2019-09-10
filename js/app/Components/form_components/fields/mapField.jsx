import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {isEmpty as _Empty} from 'lodash/fp'
import _ from 'lodash'

import {checkResponse} from "../../../Actions/utils/ActionErrors.js"
import api from "../../../Services/api.js"

import {Sport} from "../../../Reducers/reducers.js"

import drawLocalConfig from "../../../local/drawLocalConfig.js"
import {not} from "../../../Utils/boolean.js"

import {mapServer, mapService} from "../../../config.jsx"

// Transform geometry from API into Leaflet native types
class EditableMap extends Component {
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
    static LAYER_TRAIL_SECTION = 1;
    static LAYER_INCOMPLETE_TRAIL_SECTION = 2;
    static LAYER_NETWORK = 3;
    static LAYER_REGION = 4;
    static LAYER_TRAIL = 5;
    static LAYER_INCOMPLETE_TRAIL = 6;

    static defaultConfig = {
        basemap: 'Topographic',
        elevation: false,
        scale: true,
        delormeBasemap: false,
        scrollWheelZoom: false,
        showRegionLayer: false
    }

    constructor(props) {
        super(props)

        /**
         * A map config can be passed as props to the component
         * We merges the two configs using the spread operator
         * Default config is set to as the same config as the normal map
         * The default props for config is set to empty
         * so we always merge empty with default
         */
        this.config = {...this.props.config, ...EditableMap.defaultConfig}
        this.map = null


        /**
        layer styles
        **/
        this.defaultLocationStyle = { color: EditableMap.BLUE, weight: 5, opacity: 1}
        this.defaultTrailsectionStyle = { color: EditableMap.BLACK_GREEN, weight: 3, opacity: 1 };

        /**
         * Tile layers
         */
        this.trailSectionTileLayer1 = null
        this.trailSectionTileLayer2 = null

        /**
         * Mapping to convert GeoJson types to "native" leaflet polyline
         *
         * @param {Array} coordinate An array of coordinate in leaflet format (ex. use layer.getLatLngs())
         * @param {any} L The leaflet object
         * @param {Object} [options] An optional config object for the leaflet feature function
         */
        this.shapeTypes = {
            ['LineString'](coordinates, L, options = {}) {
                return L.polyline(coordinates, options)
            },
            ['MultiLineString'](coordinates, L, options = {}) {
                return L.polyline(coordinates, options)
            },
            ['Polygon'](coordinates, L, options = {}) {
                return L.polygon(coordinates, options)
            },
            ['Point'](coordinates, L, options = {}) {
                return L.marker(coordinates, options)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { input: {value}, modifTs } = this.props;

        if(_.isEqual(this.props.trailsections, nextProps.trailsections)) {
          this.displayTrailsections(this.props.trailsections, modifTs)
        } else {
          this.displayTrailsections(nextProps.trailsections, modifTs)
        }
    }

    componentDidMount() {
        const { trailsectionDetails } = this.props

        let domNode = ReactDOM.findDOMNode(this.refs.editableMap)
        this.initEditableMap(domNode, this.config)
    }

    componentWillUpdate(nextProps, nextState) {
       const { modifTs } = this.props;
       if(not(_.isEqual(this.props.trailsectionDetails, nextProps.trailsectionDetails))) {
         nextProps.trailsectionDetails ? this.updateMapField(nextProps.trailsectionDetails.data) : null
       }
       this.displayTrailsections(nextProps.trailsections, modifTs)
     }

     updateMapField = (mapFieldData) => {
          let geoJsonLayer = L.geoJson(mapFieldData.shape_2d);
          this.drawnItems.clearLayers();
          this._toLeafletNative(geoJsonLayer, this.drawnItems, L)// Add to editable item group
          this.map.fitBounds(geoJsonLayer.getBounds()) // Zoom to bound
    }

    componentWillUnmount() {
        this.handleDestroy() // Flush map and WebGL context
    }


    render() {
        return <div className="map" ref="editableMap"/>
    }

    /***************************************************
     *                    <Public>                     *
     ***************************************************/

    /**
     * Initialize the map according the the passed config
     * It also initialize the controls to draw feature on the map
     * And setup the even listeners
     *
     * @param {any} config The config with which we initialize the map
     * @param {node} domNode The DOM Node on which we mount the map
     *
     * @memberOf EditableMap
     */
    initEditableMap(domNode, config) {
        const {drawToolConfig, local, modifTs, input: {value}, trailsections, locations, location } = this.props //get the config for draw tool, local key

        this.map = L.map(domNode, config)
        /*previous mapzen map
        this.tangramLayer = Tangram.leafletLayer({
            scene: "../../../../walkabout-style.yaml",
            modifyScrollWheel: false, // [YB 2016-11-02: Tangram sets the zoomSnap of the map to 0 (Very bad!). This prevents the change. ]
            attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
        }).addTo(this.map)
        */
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

        // this.updateTrailLayer()

        this.userLocationsLayer = L.geoJSON().addTo(this.map)
        this.displayLocations(locations)

        this.locationTrailsectionsLayer = L.geoJSON().addTo(this.map)
        this.displayTrailsections(trailsections, modifTs)

        /*
         * Get local configuration from imported config object. local
         * represents a string of the current local e.i. 'fr'
         */
        // L.drawLocal = drawLocalConfig[local];
        /*
         * Creates a layer to add features to
         */
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);

        // Add tools to draw feature
        // TODO make tool config a prop
        this.map.addControl(new L.Control.Draw({
            draw: drawToolConfig,
            edit: {
                featureGroup: this.drawnItems,
                edit: true
            }
        }))

        L.Control.zoomHome({ position: 'topright', parent: this }).addTo(this.map)

        // File upload plugin
        this.fileLayerControl = L.Control.fileLayerLoad({
            layer: L.geoJson,
            layerOptions: {style: {color: "#ace268", opacity: 0.8}},
            addToMap: true,
        }).addTo(this.map)

        // If we are editting an element, zoom automatically to it
        if(not(_Empty(value))) {
            // [FBT 2017-02-17: https://github.com/Leaflet/Leaflet.draw/issues/187#issuecomment-34011402]
            let geoJsonLayer = L.geoJson(value)
                //.addTo(this.map) // Convert value to geoJsonLayer and add to map for referencing
            this._toLeafletNative(geoJsonLayer, this.drawnItems, L)// Add to editable item group
            this.map.fitBounds(geoJsonLayer.getBounds()) // Zoom to bound

            // TODO 2017-03-06 maybe use return value of toLeafletNative to add to the map after all
        } else {
          this.map.fitBounds(this.userLocationsLayer.getBounds())
        }


        /**********************************
         *            <EVENTS>            *
         **********************************/

        // Create event
        this.map.on(L.Draw.Event.CREATED, e => {
            const {input} = this.props
            let type = e.layerType,
                layer = e.layer

            this._createOrUpdateShape(layer, input.onChange)
        }, this)

        // Edit event
        this.map.on(L.Draw.Event.EDITED, e => {
            const {input} = this.props
            let layers = e.layers

            // Add all the layers again
            layers.eachLayer(layer => this._createOrUpdateShape(layer, input.onChange))
        }, this)

        this.map.on(L.Draw.Event.DELETED, e => {
            const {input} = this.props
            this._deleteShape(input.onChange)
        }, this)

        // File layer control event, also used to add to the drawable layer
        /*
        this.fileLayerControl.loader.on('data:loaded', e => {
            const {input} = this.props

            let gpxLayer= e.layer,
                hasLayers = this.drawnItems.getLayers().length > 0,
                nativeLayer = null

            let geoJsonLayer = L.geoJson(gpxLayer, {color: "#ace268", opacity: 0.8}) // Add other trails to the geojson layer
            geoJsonLayer.addTo(this.map)
            this.map.fitBounds(geoJsonLayer.getBounds()) // Fly to the added trail

            // // We check if something is drawn on the map already. If there is, we clear everything
            // if (hasLayers) this.drawnItems.clearLayers()
            // // this.drawnItems.eachLayer(layer => this.map.remove)

            // // Convert our new GPX layer to native Leaflet types to facilitate editing
            // nativeLayer = this._toLeafletNative(gpxLayer, this.drawnItems, L)

            // // We sync all of this with the store
            // this._createOrUpdateShape(nativeLayer, input.onChange)
        }, this)
        */
    }

    /**********************************
     *      Display Trailsections     *
     **********************************/
     displayTrailsections = (params, modifTs) => {
       let results = params;
       let tsBeingModified = modifTs;

       this.locationTrailsectionsLayer.clearLayers();

       let trailsections = results ? results.filter(ts => ts.shape !== null && ts.trailsection_id !== tsBeingModified) : [];

       for(let trailsection of trailsections){
         let convertedTrailSection = this.trailsectionToGeoJSON(trailsection);

         convertedTrailSection.setStyle(this.defaultTrailsectionStyle);
         this.locationTrailsectionsLayer.addLayer(convertedTrailSection);

       }
     }

     trailsectionToGeoJSON(trailsection) {
       let trailsectionLayer

       let geoJSON = {
           geometry: Object.assign({}, trailsection.shape),
           properties: Object.assign({}, trailsection),
           id: trailsection.trailsection_id,
           type: "Feature"
       };
       delete geoJSON.properties.shape;

       try {
         trailsectionLayer = L.geoJson(geoJSON)
       } catch(e) {
         trailsectionLayer = L.geoJson({
           geometry: {},
           properties: {},
           id: trailsection.id,
           type: "Feature"
         })
       }
       return trailsectionLayer;
     }

    /**********************************
     *       <Limit Drawable Area>       *
     **********************************/
    displayLocations = (params) => {
        let locationData = params
        this.userLocationsLayer.clearLayers();
        let locations = locationData ? locationData.filter(loc => loc.shape != null): []
        for(let location of locations) {
          let convertedLocation = this.LocationToGeoJSON(location)
          convertedLocation.setStyle(this.defaultLocationStyle);
          this.userLocationsLayer.addLayer(convertedLocation);
          convertedLocation.bringToFront();
        }
    }

    LocationToGeoJSON = (location) => {
        let locationLayer

        let geoJSON = {
          geometry: Object.assign({}, location.shape),
          properties: Object.assign({}, location),
          id: location.location_id,
          type: "Feature"
        };

        delete geoJSON.properties.shape;

        try {
          locationLayer = L.geoJson(geoJSON)
        } catch(e) {
          locationLayer = L.geoJson({
            geometry: {},
            properties: {},
            id: location.id,
            type: "Feature"
          })
        }
        locationLayer.layerType = 'TSLocation';

        return locationLayer;
    }

    /**
    * Renders the trails on the map
    * @param {Object} params
    *   sport {Sport} Indicates which sport(s) are enabled (there can be more then one at the same time)
    */
    // updateTrailLayer(params = 100){
    //     let sport = params.sport || params;
    //
    //     for(let tileLayer of this.tileLayers){
    //         this._toggleLayer(tileLayer, sport === tileLayer.options.activity_id);
    //     }
    // }

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


    /***************************************************
     *                  <HANDLERS>                     *
     ***************************************************/

     /**
      * handler to explicitly destroy the map. Used by componentWillUnmount to flush the map
      * but more importantly, the WebGL context witch causes all sorts of error and uses a lot of memory
      */
     handleDestroy() {
        let map = this.map
        this.map.eachLayer(layer => {
            this.map.removeLayer(layer)
        })
        this.map = null
        map.remove()
     }

    /***************************************************
     *               <PRIVATE METHODS>                 *
     ***************************************************/
    _createOrUpdateShape(layer, onChange) {
        onChange(layer.toGeoJSON()) // call the onChange method from redux-form to sync with store
        this.drawnItems.addLayer(layer)
    }

    /**
     * Remove a shape from the form object in the redux store
     *
     * @param {any} onChange The onChange function from redux form
     *
     * @memberOf EditableMap
     */
    _deleteShape(onChange) {
        onChange('')
    }

    /**
     * Converts a geoJsonObject and adds it to the drawnItems layer.
     *
     * @param   {Object} geoJSONFeatures A list of all the geoJson features
     * @param   {Object} editableLayers  The layer to add the new features to
     * @param   {Object} L               The Leaflet object
     * @returns {Object}                 The new list of native layers
     *
     * @memberOf EditableMap
     */
    _toLeafletNative(geoJSONFeatures, editableLayers, L){
        var currentFeature;
        geoJSONFeatures.getLayers().map(layer => {
            let shapeConverter = this.shapeTypes[layer.feature.geometry.type]
            currentFeature = shapeConverter
                ? shapeConverter(layer.getLatLngs(), L, {color: "#f18f01", className: "leaflet-div-icon"})
                : false
            if (shapeConverter) {currentFeature.addTo(editableLayers)}
        })
        return currentFeature
    }


    /**
     * Add network data to the map as uneditatble layer (act as a reference point for drawing features over)
     * @param {Array}  features An array of geojson shapes
     * @param {Object} L        The Leaflet object to create the geojson layer
     * @param {Object} map      The current map
     */
    _addToMap(features, L, map) {
        if (features.constructor === Array && features.length > 0) {
            let geoJsonLayer = L.geoJson(features.map(feature => feature.shape), {color: "#ace268", opacity: 0.8}) // Add other trails to the geojson layer
            geoJsonLayer.addTo(map)
            map.fitBounds(geoJsonLayer.getBounds()) // Fly to the added trails
            this.drawnItems.bringToFront() // Bring the editable layer to the front so it's not covered by trails
        }
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
     * Fetch the other trails of the network. This is to help with mapping new trails in relation to the existing others.
     * @param {any} value An id or a url pointing to the location resource
     */
    async _loadNetworkTrails(value) {
        try {
            const url = typeof value === 'string' && value.includes('http') ? `${value}trails/` :`/locations/${value}/trails/`
            const config = {
                url,
                method: 'get',
                timeout: 200000,
                params: { include: 'shape' },
                validateStatus: status => status < 500,
            }
            let response = await api.makeFetchRequest(config)

            checkResponse(checkResponse)

            return response
        } catch (error) {
            // Do something with the error
            console.log(error)
        }
    }
}

EditableMap.propTypes = {
    config: PropTypes.object,
    drawToolConfig: PropTypes.object,
    local: PropTypes.string,
    obj: PropTypes.object,
}

EditableMap.defaultProps = {
    config: {},
    drawToolConfig: {},
    local: 'fr',
    obj: {}
}

export default EditableMap
