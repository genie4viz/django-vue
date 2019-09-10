import React, {Component, PropTypes} from "react"

import {Field} from "redux-form"

import {InputField, SelectField} from "../fields/genericField.jsx"

import * as AddressValidators from '../validator/addressValidator.js'
import { countries, provinces, provincesUS } from "../utils/fieldTranslationsMapping.js"


export class Address extends Component {

  static defaultProps = {
    name: "address"
  }

  constructor(props) {
    super(props)

    this.state = {
      provincesList: provinces,
      countryChoice: 'Canada'
    }
  }

  handleCountryChange = (event) => {
    {event.target.value == 'US' ? this.setState({provincesList: provincesUS, countryChoice: 'US'}) : this.setState({provincesList: provinces, countryChoice: 'Canada'})}
  }

  render() {

    return (
      <div className="grouped fields">
        <Field
          name="street_name"
          component={InputField}
          validate={AddressValidators.validateStreetName}
          label={<label>Adresse</label>}
          required={true}/>
        <Field
          name="city"
          component={InputField}
          validate={AddressValidators.validateCity}
          label={<label>Ville</label>}
          required={true}/>
        <Field
          name="country"
          component={SelectField}
          validate={AddressValidators.validateCountry}
          label={<label>Pays</label>}
          onChange={this.handleCountryChange}
          options={countries}
          required={true}/>
        <Field
          name="province"
          component={SelectField}
          validate={AddressValidators.validateProvince}
          options={this.state.provincesList}
          label={<label>Province</label>}
          required={true}/>
        <Field
          name="postal_code"
          component={InputField}
          normalize={value => value.trim().replace(/ /g, ' ')}
          validate={ (postcode, countryName) => AddressValidators.validatePostalCode(postcode, this.state.countryChoice)}
          label={<label>Code postal</label>}
          required={true}/>
      </div>
    )
  }
}
