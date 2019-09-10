import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import {reduxForm, Field, FieldArray, change, formValueSelector} from "redux-form"
import { DateUtils } from "react-day-picker"

import {Tooltip} from "../basic_components/tooltip.jsx"

import {DayPickerInputField, ExploitationPeriods} from "../form_components/fields/daypickerInputField.jsx"
import {SimpleFileFields} from "../form_components/fields/simpleFileInputField.jsx"
import {CheckboxField, InputField, SelectField, TextAreaField} from "./fields/genericField.jsx"

import EditableMap from '../form_components/fields/mapField.jsx'

import shapeParser from "./utils/parsers.js"
import {validate} from "./validator/trailFormValidator.js"

import {scrollToFirstError} from './utils/scrollToError.js'

// Create selector to get the values of the form
const selector = formValueSelector('trail-data-form')

const regions = [
    {id: 6078, name:"Îles-de-la-Madeleine"},
    {id: 6079, name: "Gaspésie"},
    {id: 6080, name: "Bas-Saint-Laurent"},
    {id: 6082, name: "Charlevoix"},
    {id: 6083, name: "Chaudière-Appalaches"},
    {id: 6084, name: "Mauricie"},
    {id: 6085, name: "Cantons-de-l'Est"},
    {id: 6086, name: "Montérégie"},
    {id: 6087, name: "Lanaudière"},
    {id: 6088, name: "Laurentides"},
    {id: 6081, name: "Région de Québec"},
    {id: 6089, name: "Montréal"},
    {id: 6090, name: "Outaouais"},
    {id: 6091, name: "Abitibi-Témiscamingue"},
    {id: 6092, name: "Saguenay-Lac-Saint-Jean"},
    {id: 6093, name: "Manicouagan"},
    {id: 6094, name: "Duplessis"},
    {id: 6095, name: "Baie-James et Eeyou Istchee"},
    {id: 6096, name: "Laval"},
    {id: 6097, name: "Centre-du-Québec"},
    {id: 6098, name: "Nunavik"},
    {id: 6099, name: "Côte-Nord"},
    {id: 6100, name: "Nord-du-Québec"},
    {id: 6128, name: "New-York"},
    {id: 6129, name: "Maine"},
    {id: 6130, name: "Vermont"},
    {id: 6131, name: "New-Hampshire"},

]

const handleDayClick = (value, e, day, modifier) => {
  return DateUtils.addDayToRange(day, value)
}

export class TrailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClosedChecked: "0"
    }

    this.handleIsClosedRadioClick = this.handleIsClosedRadioClick.bind(this)
  }

  render() {
    const {
        userLocations,
        userPermissions,
        trailsections,
        locations
    } = this.props
    const canEdit = !(userPermissions === 1)
    return (
        <div className="edit-form ui form">

            <div className="edit-form__text">
              <Field name="trail_id" component="input" type="hidden"/>

              {/* NAME */}
              <div id='position-name'>
                  <Field
                    name="name"
                    component={InputField}
                    label={<label>Nom</label>}
                    required={true}
                    />
              </div>

                {/* PARK */}
                <div id='position-location'>
                    <Field
                      name="location"
                      component={SelectField}
                      normalize={value => parseInt(value)}
                      options={userLocations}
                      label={<label>Réseau</label>}
                      required={true}
                      />
                </div>

                {/* TOURISTIC REGION */}
                <div id='position-region'>
                    <Field
                      name='region'
                      component={SelectField}
                      normalize={value => parseInt(value)}
                      options={regions}
                      label={<label>Région touristique</label>}
                      required={true}
                      />
                </div>

              {/* TODO Put that in its own component to manage errors */}
                {/* SPORTS TYPE */}
                <div className="required grouped fields">
                  <label>Types d&apos;activités</label>
                  <Field
                    name="activities[0]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Randonnée pédestre</label>}/>
                  <Field
                    name="activities[1]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Raquette</label>}/>
                  <Field
                    name="activities[2]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Randonnée hivernale</label>}/>
                  <Field
                    name="activities[3]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Vélo de montagne</label>}
                    />
                  <Field
                    name="activities[4]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Fatbike</label>}
                    />
                  <Field
                    name="activities[5]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Vélo</label>}
                    />
                  <Field
                    name="activities[6]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Ski de fond</label>}
                    />
                  <Field
                    name="activities[7]"
                    component={CheckboxField}
                    type="checkbox"
                    label={<label>Équitation</label>}
                    />
                </div>

                  {/* FERMETURE EXCEPTIONNELLE CHECKBOX */}
                  <div className="grouped fields">
                    <h4>Fermeture exceptionnelle</h4>
                    <div className="inline field">
                        <div className="ui radio checkbox">
                            <input type="radio" value="0" checked={this.state.isClosedChecked === "0"} onChange={this.handleIsClosedRadioClick}/>
                            <label>Aucune</label>
                        </div>
                    </div>
                    <div className="inline field">
                        <div className="ui radio checkbox">
                            <input type="radio" value="1" checked={this.state.isClosedChecked === "1"} onChange={this.handleIsClosedRadioClick}/>
                            <label>Spécifier la raison</label>
                        </div>
                    </div>
                    {this.state.isClosedChecked === "1"
                        && <div className="fields">
                            <Field name="closed" rows="3" component={TextAreaField}/>
                        </div>}
                    </div>

                {/* DIFFICULTY */}
                <Field
                    name="difficulty"
                    component={SelectField}
                    options={[
                      {id: 1, name: "Débutant"},
                      {id: 2, name: "Intermédiaire"},
                      {id: 3, name: "Avancé"},
                      {id: 4, name: "Aguerri"},
                      {id: 5, name: "Expert"},
                    ]}
                    normalize={value => parseInt(value)}
                    label={
                      <label>
                        Difficulté
                        &nbsp;
                        <Tooltip
                          content={
                            <div>
                              <h4>Légende</h4>
                              <img className="ui large image" src="/static/img/graph_difficulty.png" alt=""/>
                            </div>
                          }>
                          <i className="icon-Information"/>
                        </Tooltip>
                      </label>
                    }/>

                <Field
                  name="path_type"
                  component={SelectField}
                  options={[
                      {id: 1, name: "Aller simple"},
                      {id: 2, name: "Boucle"},
                      {id: 3, name: "Aller-retour"},
                  ]}
                  label={<label>Type de sentier</label>}
                  />

                {/* STATS */}
                <div className="inline grouped fields">
                  <div id="position-total_length">
                      <Field
                        name="total_length"
                        component={InputField}
                        type="number"
                        label={<label>Distance&nbsp;<small>(en m)</small></label>}
                        normalize={value => parseInt(value)}
                        labelPosition="top"
                        required={true}/>
                  </div>

                  <Field
                    name="highest_point"
                    component={InputField}
                    type="number"
                    label={<label>Point le plus haut&nbsp;<small>(en m)</small></label>}
                    labelPosition="top"/>
                  <Field
                    name="lowest_point"
                    component={InputField}
                    type="number"
                    label={<label>Point le plus bas&nbsp;<small>(en m)</small></label>}
                    labelPosition="top"/>
                  <Field
                    name="height_positive"
                    component={InputField}
                    type="number"
                    label={<label>Dénivelé positif&nbsp;<small>(en m)</small></label>}
                    labelPosition="top"  />
                  <Field
                    name="height_negative"
                    component={InputField}
                    type="number"
                    label={<label>Dénivelé négatif&nbsp;<small>(en m)</small></label>}
                    labelPosition="top"
                    />
                </div>

                {/* DESCRIPTION */}
                <div id='position-description'>
                  <Field
                    name="description"
                    rows="3"
                    component={TextAreaField}
                    label={<label>Description</label>}
                    type="text"
                    required={true}
                    />
                </div>

            </div>

            {/* BANNER IMAGES */}
            <FieldArray name="images" component={SimpleFileFields}/>

            <div className="ui divider"></div>

            <div className="edit-form__map">
                <Field
                  name="shape"
                  component={EditableMap}
                  locations={locations}
                  trailsections={trailsections}
                  parse={shapeParser} // parse data for api
                  config={
                    {
                      center: [50.13466432216696, -72.72949218750001],
                      zoom: 6,
                      zoomControl: false,
                      zoomAnimation: true,
                      minZoom: 3,
                      maxZoom: 17,
                      scrollWheelZoom: true,
                      delormeBasemap: true,
                      showRegionLayer: true // Crop the map if the side panel is opened
                    }
                  }
                  drawToolConfig={ {polygon: false, marker: false, circle: false, rectangle: false} }
                  />
            </div>
        </div>
    )
  }

  handleIsClosedRadioClick = event => {
    let value = event.target.value
    const {dispatch, form} = this.props

    switch (value) {
      case "0":
        dispatch(change(form, "closed", "Fermé"))
        this.setState({isClosedChecked: value})
        break
      case "1":
        dispatch(change(form, "closed", ""))
        this.setState({isClosedChecked: value})
        break
    }
  }
}

export default reduxForm({form: "trail-data-form", validate, onSubmitFail: (errors) => scrollToFirstError(errors)})(TrailForm)

// export default connect(state => {
//   const trailNetwork = selector(state, 'location')
//   return {trailNetwork}
// }, null, null)(TrailForm)
