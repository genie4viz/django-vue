import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, submit } from "redux-form";
import { CheckboxGroup, InputField, TextAreaField, SelectField } from "./fields/genericField.jsx"
import {scrollToFirstError} from './utils/scrollToError.js'

import EditableMap from '../form_components/fields/mapField.jsx'
import { extractGeom } from "./utils/parsers.js"

import { validate } from "./validator/trailsectionFormValidator.js"

const sportOptions = [
  {label: 'Randonnée pédestre', value: 1},
  {label: 'Raquette', value: 2},
  {label: 'Randonnée hivernale', value: 3},
  {label: 'Vélo de montagne', value: 4},
  {label: 'Fatbike', value: 5},
  {label: 'Vélo', value: 6},
  {label: 'Ski de fond', value: 7},
  {label: 'Équitation', value: 8}
];

export class TrailSectionForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { trailsections, locations, trailsectionDetails, location, modifTs } = this.props

    return (
      <div className="edit-form ui form">
         <div className="edit-form__text">
           <Field name="trailsection_id" component={InputField} type="text" disabled={true} type={ this.props.location.pathname.includes('createnewtrailsection') ? "hidden" : null} label={<label>Tronçon ID</label>}/>
           <div id='position-name' className="required grouped fields">
              <Field name="name" component={InputField} type="text" label={<label>Nom</label>} required={true}/>
          </div>

           <div className="required grouped fields">
               <label>Types d&apos;activités</label>
               <CheckboxGroup name='activity' options={sportOptions} />
          </div>

          <div className="required grouped fields">
              <Field name="comments" component={TextAreaField} rows="5" label={<label>Commentaire</label>} type="text"/>
          </div>
        </div>
        <div className="edit-form__map">
            <div id='position-shape_2d'>
                <Field
                  name="shape_2d"
                  component={EditableMap}
                  modifTs={modifTs}
                  trailsections={trailsections}
                  trailsectionDetails={trailsectionDetails}
                  locations={locations}
                  parse={extractGeom} // parse data for api
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
                  drawToolConfig={ {polygon: false, marker: false, circle: false, rectangle: false} }/>
            </div>
        </div>
     </div>
    )
  }
}

export default TrailSectionForm = reduxForm({form: "trailsection-data-form", enableReinitialize: true, validate, onSubmitFail: (errors) => scrollToFirstError(errors) })(TrailSectionForm)
