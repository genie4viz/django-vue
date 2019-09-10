import React, {Component, PropTypes} from "react"
import axios from "axios"
import {reduxForm, Field, reset} from "redux-form"
import classNames from "classnames"
import { DateUtils } from "react-day-picker"
import * as moment from "moment"

import {DayPickerField} from "../form_components/fields/daypickerField.jsx"
import {InputField, TextAreaField} from "../form_components/fields/genericField.jsx"
import {validate} from "./validator/mailFormValidator.js"
import {FormState} from "./states/formStates.js"

import {notificationSend} from "../../Actions/notificationActions.jsx"

import store from "../../Store/store.jsx"

import {API_ROOT} from "../../config.jsx"


/**
 * Custom click handler for month to pass as props. This is to dynamically extends
 * the functionality of the DayPicker wrapper without redefining the wrapper every time
 * @param  {[React Synthetic Event]} e        [The click event]
 * @param  {[Date]}                  day      [The date clicked]
 * @param  {[Object]}                modifier [modifier to check if the day is disabled]
 * @param  {[Object]}                value    [The current value of the form input. Comes from the Field component props]
 * @return {[Object]}                         [A object containing the date range]
 */
const handleDayClick = (value, e, day, modifier) => {
  if (modifier.disabled) return

  return DateUtils.addDayToRange(day, value)
}

const submitReservation = async formData => {
  try {
    let response = await axios({
      method: "post",
      url: `${API_ROOT}/reservations/`,
      data: formData,
      timeout: 200000
    })

    if(response.status < 400) {
      store.dispatch(reset("reservation-form"))
      store.dispatch(notificationSend({label: "app", message: "Votre message a bien été envoyé!", timeout: 2000}))
    } else {
      throw new Error(`${response.status}`)
    }

    return response
  } catch (err) {
    store.dispatch(notificationSend({label: "app", message: "Désolée! Une erreur s'est produite.", timeout: 2000}))
    return err
  }
}

const ReservationForm = props => {
  const {handleSubmit, invalid, submitting, valid} = props

  let formState = FormState(submitting)

  return (
    <div className={`mail-reservation-form ${formState}`}>

      <Field name="email_to" component="input" type="hidden"/>

      {/* Name and Surname */}
      <div className="grouped required fields">
        <label>Nom complet</label>
        <Field name="first_name" component={InputField} type="text" placeholder="Prénom"/>
        <Field name="last_name" component={InputField} type="text" placeholder="Nom"/>
      </div>

      {/* Email */}
      <Field name="email_from" component={InputField} type="email" placeholder="test@votremail.com"/>

      {/* Phone */}
      <Field
        name="phone_number"
        component={InputField}
        type="tel"
        placeholder="ex. 333 444-555"
        label={<label>Téléphone</label>}
        required={true}
        />

      <div>
        <label>Dates</label>
        <Field
          name="reservation_dates"
          component={DayPickerField}
          disabledDays={DateUtils.isPastDay}
          />
      </div>

      {/* Number of people */}
      <div className="equal witdth fields">
        <Field
          name="people.adults"
          component={InputField}
          type="number"
          min="0"
          label={<label>Adultes</label>}
          />
        <Field
          name="people.children"
          component={InputField}
          type="number"
          min="0"
          label={<label>Enfants</label>}
          />
        <Field
          name="people.babies"
          component={InputField}
          type="number"
          min="0"
          label={<label>Bébés</label>}
          />
      </div>

      {/* Message */}
      <Field
        name="message"
        rows="2"
        component={TextAreaField}
        label={<label>Message</label>}
        />

      <button
        className={classNames({
          "fluid ui button": valid,
          "fluid ui disabled button": invalid
        })}
        onClick={handleSubmit(submitReservation)}
        >
        Soumettre demande
      </button>
    </div>
  )
}

export default reduxForm({form: "reservation-form", validate})(ReservationForm)
