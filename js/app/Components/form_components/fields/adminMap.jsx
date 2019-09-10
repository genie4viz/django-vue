import React, {Component, PropTypes} from 'react'
import {connect} from "react-redux";
import ReactDOM from 'react-dom'
import {isEmpty as _Empty} from 'lodash/fp'
import { push } from "react-router-redux";

import store from "../../../Store/store.jsx"

import {checkResponse} from "../../../Actions/utils/ActionErrors.js"
import api from "../../../Services/api.js"

import {Sport} from "../../../Reducers/reducers.js"

import drawLocalConfig from "../../../local/drawLocalConfig.js"
import {not} from "../../../Utils/boolean.js"

import {mapServer, mapService} from "../../../config.jsx"

import cloneLayer from "leaflet-clonelayer";

const mapStateToProps = (state) => {
  return {
    username: state.user.profile.username,
    legend: state.legend,
  }
}
// Transform geometry from API into Leaflet native types
export class AdminMap extends Component {

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

    constructor(props) {
        super(props)

        this.map = null

        this.config = {
            basemap: "Topographic",
            elevation: false,
            scale: true,
            delormeBasemap: false,
            scrollWheelZoom: true,
            showRegionLayer: false
        }

        this.defaultTrailsectionStyle = { color: AdminMap.BLACK_GREEN, weight: 3, opacity: 1 };
        this.highlightTrailsectionStyle = { color: AdminMap.ORANGE, weight: 7, opacity: 1};
        this.defaultLocationStyle = { color: AdminMap.BLUE, weight: 5, opacity: 2}

    }

    componentDidMount() {
      this._initMap({
          domNode: "adminMap",
          delormeBasemap: true,
          elevation: false,
          scrollWheelZoom: false
      })

      if(this.props.locations && !_Empty(this.props.locations)) {
        this.displayLocations(this.props.locations)
      }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.trailsections) {
          this.displayTrailsections({ results: nextProps.trailsections })
        }
    }

    componentWillUnmount() {
        this._handleDestroy() // Flush map and WebGL context
    }

    render() {
      const { locations, trails, trailsections } = this.props

      return <div className="map" id="adminMap"></div>
    }

    _initMap(config, tsFromProps) {
      Object.assign(this.config, config);

      this.map = L.map(this.config.domNode, {
          center: [50.13466432216696, -72.72949218750001],
          zoom: 11,
          zoomControl: false,
          zoomAnimation: true,
          minZoom: 3,
          maxZoom: 17,
      })

      L.Control.zoomHome({ position: 'topright', parent: this }).addTo(this.map)

      // ====== mapbox ======
      let tileFormat = '';
      var MapBox = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}' + tileFormat + '?access_token=pk.eyJ1IjoiY2xhaXJlZGVndWVsbGUiLCJhIjoiY2ozazVraGkzMDB4NTJ3cXQ2NXd4YjZrYiJ9.aeR6EKn38zvZTvCVMgTdDA', {
        attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      // Trails tile layers (1 per sport + 1 for all sports combined)
      this.tileLayers = [];
      this._addTileLayer(Sport.RANDONNEE);
      this._addTileLayer(Sport.RAQUETTE);
      this._addTileLayer(Sport.RANDONNEE_HIVERNALE);
      this._addTileLayer(Sport.VELO_DE_MONTAGNE);
      this._addTileLayer(Sport.FATBIKE);
      this._addTileLayer(Sport.VELO);
      this._addTileLayer(Sport.SKI_DE_FOND);
      this._addTileLayer(Sport.EQUITATION);
      this._addTileLayer(Sport.ALL);

      this.userLocationsLayer = new L.FeatureGroup();
      this.map.addLayer(this.userLocationsLayer);

      this.highlightlayers = L.geoJson().addTo(this.map);

      this.resultLayers = L.geoJson().addTo(this.map);

      this.selectionLayers = L.geoJson().addTo(this.map);

    }

    /********************
    *      LOCATION     *
    ********************/
    displayLocations = (params) => {
      let locationData = params;
      this.userLocationsLayer.clearLayers();
      let locations = locationData ? locationData.filter(loc => loc.shape != null) : [];
      for(let location of locations) {
        let convertedLocation = this.locationToGeoJSON(location)
        convertedLocation.setStyle(this.defaultLocationStyle);
        this.userLocationsLayer.addLayer(convertedLocation);
        convertedLocation.bringToFront();
      }
    }

    locationToGeoJSON = (location) => {
      let locationLayer

      let geoJSON = {
          geometry: Object.assign({}, location.shape),
          properties: Object.assign({}, location),
          id: location.id,
          type: "Feature"
      };
      delete geoJSON.properties.shape;

      try {
        locationLayer = L.geoJson(geoJSON, {onEachFeature: this.onEachLocationFeature })
      } catch(e) {
        locationLayer = L.geoJson({
          geometry: {},
          properties: {},
          id: location.id,
          type: "Feature"
        })
      }
      locationLayer.layerType = 'location';

      return locationLayer;
    }

    onEachLocationFeature = (feature, layer) => {
      let toolTipContent = "<div id='ts-'" + feature.id + ">" + String(feature.properties.name) + "<br><small>Cliquez dans le parc pour créer une nouvelle tronçon</small></div>";
      layer.bindTooltip(toolTipContent);
      layer.on('mouseover', e => layer.openTooltip(layer.getBounds().getNorthEast()));
      layer.on('click', (e) => {this.onLocationClick(e, feature, layer)});
    }

    onLocationClick = (e, feature, layer) => {
      store.dispatch(push(`/admin/${this.props.username}/${feature.id}/createnewtrailsection/`))
    }

    /********************
    *   TRAIL SECTION   *
    ********************/
    displayTrailsections = (params) => {
      let results = params.results;

      this.resultLayers.clearLayers();

      let trailsections = results ? results.filter(ts => ts.shape !== null) : [];

      for(let trailsection of trailsections){
        let convertedTrailSection = this.trailsectionToGeoJSON(trailsection);

        convertedTrailSection.setStyle(this.defaultTrailsectionStyle);
        this.resultLayers.addLayer(convertedTrailSection);

        convertedTrailSection.bringToFront();
      }
      this.zoomResults();
    }

    trailsectionToGeoJSON(trailsection) {
      let trailsectionLayer

      let geoJSON = {
          geometry: Object.assign({}, trailsection.shape),
          properties: Object.assign({}, trailsection, { "popupContent": trailsection.trailsection_id }),
          id: trailsection.trailsection_id,
          type: "Feature"
      };
      delete geoJSON.properties.shape;

      try {
        trailsectionLayer = L.geoJson(geoJSON, {onEachFeature: this.onEachTSFeature})
      } catch(e) {
        trailsectionLayer = L.geoJson({
          geometry: {},
          properties: {},
          id: trailsection.id,
          type: "Feature"
        })
      }

      trailsectionLayer.layerType = 'Trailsection';

      trailsectionLayer.on('mouseover', (e) => { L.DomEvent.stopPropagation(e); this.highlightTrailsection({ trailsectionLayers: [trailsectionLayer] }) });

      return trailsectionLayer;
    }

    onEachTSFeature = (feature, layer) => {
      let popupContent = "<div id='ts-'" + feature.properties.popupContent + ">" + String(feature.properties.popupContent) + "</div>";
      layer.bindPopup(popupContent);
      layer.on('mouseover', e => layer.openPopup());
      layer.on('click', (e) => {this.onTsClick(e, feature, layer)});
    }

    onTsClick = (e, feature, layer) => {
      store.dispatch(push(`/admin/${this.props.username}/trailsections/${feature.id}/`))
    }

    highlightTrailsection = (params) => {
      let trailsectionLayers = params.trailsectionLayers;

      this.highlightlayers.clearLayers();

      if(trailsectionLayers) {
        for(let trailsectionLayer of trailsectionLayers){
          let clone = cloneLayer(trailsectionLayer);
          clone.setStyle(this.defaultTrailsectionStyle);
          let haloclone = cloneLayer(trailsectionLayer);
          haloclone.setStyle(this.highlightTrailsectionStyle);
          this.highlightlayers.addLayer(haloclone);
          this.highlightlayers.addLayer(clone);

          clone.bringToFront();

          clone.on('mouseout', (e) => { L.DomEvent.stopPropagation(e); clearTimeout(this.timer); this.timer = setTimeout(() => { this.highlightlayers.clearLayers(); }, 200) });
        }
      }
    }

    /********************
    *   SPORTS LAYERS   *
    ********************/
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

    _addTileLayer = (activity_id) => {
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

    /********************
    *    OTHER TOOLS    *
    ********************/
    zoomResults(){
        this.map.fitBounds(this.userLocationsLayer.getBounds(), {animate: true});
    }

    _handleDestroy() {
       let map = this.map
       this.map.eachLayer(layer => {
           this.map.removeLayer(layer)
       })
       this.map = null
       map.remove()
    }

}

AdminMap = connect(mapStateToProps)(AdminMap)

/* MAP server query: filter TS by location geometry
{ "geometryType":"esriGeometryPolygon",
 "spatialReference": {"wkid": 4326},
 "fields": ["shape"],
 "features": {
    "rings":[ [[-78.683618923, 48.161727368], [-78.683618923, 48.18846656], [-78.649235711, 48.18846656], [-78.649235711, 48.161727368], [-78.683618923, 48.161727368]] ],
    "spatialReference": { "wkid" : 4326 }
  },
}
*/
