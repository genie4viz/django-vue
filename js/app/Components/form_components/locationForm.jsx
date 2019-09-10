import React, {Component, PropTypes} from "react"
import {connect} from 'react-redux'
import {reduxForm, Field, FieldArray, FormSection, change, arrayPush, formValueSelector, initialize} from "redux-form"
import {DateUtils} from "react-day-picker"
import Dropzone from "react-dropzone"
import moment from 'moment' // eslint-disable-line

import {MapHikster} from "../../Map/mapClass.jsx"
import {Tooltip} from "../basic_components/tooltip.jsx"

import {Address} from "./sections/address.jsx"

import {DayPickerField} from "../form_components/fields/daypickerField.jsx"
import {DayPickerInputField, ExploitationPeriods, ScheduleInputField} from "../form_components/fields/daypickerInputField.jsx"
import {renderContactFields} from "../form_components/fields/contactField.jsx"
import {FileInputField} from "../form_components/fields/fileInputField.jsx"
import {SimpleFileFields} from "../form_components/fields/simpleFileInputField.jsx"
import {CheckboxField, InputField, SelectField, TextAreaField} from "./fields/genericField.jsx"
import EditableMap from "./fields/mapField.jsx"

import {FieldState, FormState} from './states/formStates.js'

import {extractGeom} from "./utils/parsers.js"

import {validate} from "./validator/locationFormValidator.js"

import {not} from "../../Utils/boolean.js"

import {scrollToFirstError} from './utils/scrollToError.js'

import {SITE_PATH} from "../../config.jsx"

function handleInputChange(e) {
	const {value} = e.target;
	const momentDay = moment(value, 'L', true);
	if (momentDay.isValid()) {
		this.setState({
			selectedDay: momentDay.toDate()
		}, () => {
			this.daypicker.showMonth(this.state.selectedDay);
		});
	} else {
		this.setState({selectedDay: null});
	}
	return this.state.value
}

function handleDayClick(value, e, day, modifier) {
	return DateUtils.addDayToRange(day, value)
}

const selector = formValueSelector('location-data-form')

const initialData = {
	address: {
		'province': 'Québec',
		'country': 'Canada'
	},
	dog_allowed: false
}
// TODO do validation
export class LocationForm extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		form: PropTypes.string.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		initialValues: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			isLocationAllYear: '0',
			isLocationFree: '0',
			scheduleRadio: '0',
			photos: []
		}
	}

	componentDidMount() {

		const {exploitation_periods, fare_note} = this.props

		// We only need to setState when it's not the default case
		if (exploitation_periods
            && exploitation_periods.length <= 1
            && exploitation_periods[0]
            && not(Object.prototype.hasOwnProperty.call(exploitation_periods[0], 'period'))) {
			this.setState({isLocationAllYear: '0'})
		} else {
			this.setState({isLocationAllYear: '1'})
		}

		if (not(fare_note === "Gratuit" || fare_note === '')) this.setState({isLocationFree: '1'})

		if(!this.props.initialValues) {
			this.handleAddressInitialize()
		}
	}

	handleAddressInitialize = () => {
		this.props.initialize(initialData)
	}

	render() {
		const {dispatch, submitting, initialValues } = this.props

		const {isLocationFree} = this.state

		return (
			<div className={ submitting ? FormState(submitting) : `edit-form ${FormState(submitting)}`}>

				<div className="edit-form__text">
					<Field name="location_id" component="input" type="hidden"/>
					<Field name="type" component="input" type="hidden"/>

					{/* NAME */}
					<div id='position-name'>
							<Field
								name="name"
								component={InputField}
								type="text"
								label={<label>Nom du réseau</label>}
								required={true}/>
					</div>

					<div className="ui divider"></div>

					{/* ADDRESS */}
					<div id='position-address'>
							<FormSection name='address'>
									<Address />
							</FormSection>
					</div>

					{/* CONTACT */}
					<div id='position-contact' className="required inline field">
							<label>Contact</label>
							<FieldArray
									name="contact"
									component={renderContactFields}
									/>
					</div>

					<div className="ui divider"></div>

					{/* BANNER IMAGES */}
					<div className="inline field">
							<label>Images</label>
							<FieldArray name="images" component={SimpleFileFields}/>
					</div>

						{/* ACCESS PERIOD TYPE */}
					<div className="required grouped fields">

							<div className="required field"> <h4>Période d&rsquo;accès</h4></div>

							<div className="inline field">
								<div className="ui radio checkbox">
									<input type="radio" value="0" checked={this.state.isLocationAllYear === "0"} onChange={event => this.handleScheduleCheckboxClick(event)}/>
									<label>Toute l&rsquo;année</label>
								</div>
							</div>
							{this.state.isLocationAllYear === "0" && <ScheduleInputField name="exploitation_periods[0]"/>}
							<div className="inline field">
								<div className="ui radio checkbox">
									<input type="radio" value="1" checked={this.state.isLocationAllYear === "1"} onChange={event => this.handleScheduleCheckboxClick(event)}/>
									<label>Autre</label>
								</div>
							</div>
							{this.state.isLocationAllYear === "1" && <div className="fields">
								<FieldArray
									name="exploitation_periods"
									handleDayClick={handleDayClick}
									component={ExploitationPeriods}
									canSpecifyTime={true}
									/></div>}
						</div>

						{/* PRICES */}
						<div className="required grouped fields">
							<div className="required field"><h4>Tarifs</h4></div>
							<div className="inline field">
								<div className="ui radio checkbox">
									<input type="radio" value="0" checked={this.state.isLocationFree === "0"} onChange={event => this.handlePricesCheckboxClick(event)}/>
									<label>Gratuit</label>
								</div>
							</div>
							<div className="inline field">
								<div className="ui radio checkbox">
									<input type="radio" value="1" checked={this.state.isLocationFree === "1"} onChange={event => this.handlePricesCheckboxClick(event)}/>
									<label>Autre</label>
								</div>
							</div>
							{this.state.isLocationFree === "1" && <div className="field">
								<Field
									name="fare_note"
									rows="3"
									component={TextAreaField}
									/>
							</div>}
						</div>

					<div className="ui divider"></div>

					<div id="position-transport">
						<Field
							name="transport"
							rows="4"
							component={TextAreaField}
							label={
								<label>
									<Tooltip content="Donner un trajet auto"><span>Accès</span></Tooltip>
								</label>
							}/>
					</div>

						{/* DESCRIPTION */}
						<div id='position-description'>
								<Field
									name="description"
									rows="6"
									component={TextAreaField}
									label={
										<label>
											<Tooltip content="Ajouter une description ici"><span>Description</span></Tooltip>
										</label>
									}
									required={true}/>
						</div>

							<Field
							  rows="2"
								name="living_rules"
								component={TextAreaField}
								label={<label>Règles de vie</label>}/>

						<div className="edit-form__dog">
							<img className="ui mini image" src={`/static/img/dog.png`}/>
							<Field
								name="dog_allowed"
								component={CheckboxField}
								type="checkbox"
								label={<label>Chiens tolérés?</label>}
								/>
						</div>

					</div>

					<div className="ui divider"></div>

					<div className="edit-form__map">
						<Field
							name="shape"
							component={EditableMap}
							parse={extractGeom}
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
							drawToolConfig={ {polyline: false, marker: false, circle: false, rectangle: false} }
							/>
					</div>
				</div>
		)
	}

	handlePricesCheckboxClick = event => {
		let value = event.target.value
		const {dispatch, form} = this.props

		switch (value) {
			case "0":
				dispatch(change(form, "fare_note", "Gratuit"))
				this.setState({
					isLocationFree: value
				})
				break;
			case "1":
				dispatch(change(form, "fare_note", ''))
				this.setState({
					isLocationFree: value
				})
				break;

		}
	}

	handleScheduleCheckboxClick = event => {
		let value = event.target.value
		const {dispatch, form} = this.props

		switch (value) {
			case "0":
				this.setState({
					isLocationAllYear: value
				})
				break;
			case "1":
				this.setState({
					isLocationAllYear: value
				})
				break;

		}
	}

	handleRadioClick = event => {
		let value = event.target.value
		const {dispatch, form} = this.props
		switch (value) {
			case "0":
				dispatch(change(form, "schedule", value))
        this.setState({scheduleRadio: value})
        break
			case "1":
				dispatch(change(form, "schedule", value))
        this.setState({scheduleRadio: value})
        break
			case "2":
				dispatch(change(form, "schedule", {}))
        this.setState({scheduleRadio: value})
        break
		}
	}

	handleOnDrop = upload => {
		const {dispatch, form} = this.props
		dispatch(arrayPush(form, "images", {}))
	}
}

LocationForm = connect(state => {
	const {exploitation_periods, fare_note} = selector(state, 'exploitation_periods', 'fare_note')
	return {
		exploitation_periods,
		fare_note
		}
})(LocationForm)

export default LocationForm = reduxForm({form: "location-data-form", validate, onSubmitFail: (errors) => scrollToFirstError(errors)})(LocationForm)
