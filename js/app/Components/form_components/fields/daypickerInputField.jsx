import React, { Component, PropTypes } from 'react'
import {Field, change} from "redux-form"
import DayPicker, { DateUtils } from "react-day-picker"
import MomentLocaleUtils from "react-day-picker/moment"
import moment from 'moment' // eslint-disable-line

import {InputField} from "../fields/genericField.jsx"

import {dateRangeFormatter} from "../utils/formatters.js"

/******************************************
 * RENDER FUNCTION HELPER FOR FIELDARRAYS *
 ******************************************/
export const ScheduleInputField = props => {
  const {name} = props
  return (
    <div className="field">
      <div className="two fields">
        <Field 
          name={`${name}.schedule.from`} 
          component={InputField} 
          type="time"
          label={<label>De</label>}
          placeholder="00:00"
          />
        <Field 
          name={`${name}.schedule.to`} 
          component={InputField} 
          type="time"
          label={<label>À</label>}
          placeholder="00:00"
          />
      </div>
    </div>
  )
}

ScheduleInputField.propTypes = {
  name: PropTypes.string.isRequired
}

export const ExploitationPeriods = props => {
  const {fields, meta: {touched, error}, handleDayClick, canSpecifyTime} = props
 	return (
 		<ul>
 			{fields.map((exploitation_periods, index) => {
 				return (
 					<li key={index} className="grouped fields">
 						<div className="field">
 							<Field
               name={`${exploitation_periods}.period`}
               format={dateRangeFormatter}
               component={DayPickerInputField}
               handleDayClick={handleDayClick}
              />
 						</div>
            {canSpecifyTime && <ScheduleInputField name={exploitation_periods}/>}
 						<div className="field">
 							<button
 								className="ui red tiny button"
 								onClick={() => fields.remove(index)}
 								>
 								Enlever
 							</button>
 						</div>
 					</li>
 				)
 			})}
 			<li>
 				<div className="field">
 					<button className="ui button" onClick={() => fields.push({})}>Ajouter une période</button>
 					{touched && error && <span>{error}</span>}
 				</div>
 			</li>
 		</ul>
 	)
 }

ExploitationPeriods.defaultProps = {
  canSpecifyTime: false
}

ExploitationPeriods.prototype = {
  canSpecifyTime: PropTypes.bool
}

/**********************
 * ACTUAL INPUT FIELD *
 **********************/

const overlayStyle = {
  position: 'absolute',
  background: 'white',
  boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
  zIndex: "1"
}

export class DayPickerInputField extends Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this)
  }

  state = {
    showOverlay: false,
    selectedDay: null,
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout)
  }

  input = null
  daypicker = null
  clickedInside = false
  clickTimeout = null

  handleContainerMouseDown() {
    this.clickedInside = true
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleInputFocus() {
    this.setState({
      showOverlay: true,
    })
  }

  handleInputBlur() {
    const showOverlay = this.clickedInside

    this.setState({
      showOverlay,
    })

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus()
    }
  }

  handleDayClick(e, day) {
    this.setState({
      selectedDay: day,
      showOverlay: false,
    })
    this.input.blur()
    return moment(day).format('L')
  }

  render() {
    const {input: {onChange, value}, handleDayClick} = this.props
    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <input
          type="text"
          ref={ el => { this.input = el } }
          placeholder="DD/MM/YYYY"
          value={ this._renderInputValue(value) }
          onChange={() => {}}
          onFocus={ this.handleInputFocus }
          onBlur={ this.handleInputBlur }
        />
        { this.state.showOverlay &&
          <div style={ { position: 'relative' } }>
            <div style={ overlayStyle }>
              <DayPicker
                ref={ el => { this.daypicker = el } }
                onDayClick={
                  (...args) => {
                    onChange(handleDayClick(value, ...args))
                  }
                }
                selectedDays={day => DateUtils.isDayInRange(day, value)}
              />
            </div>
          </div>
        }
      </div>
    )
  }

  _renderInputValue = value => `Du ${moment(value.from).format('D MMM')} au ${moment(value.to).format('D MMM')}`
}
