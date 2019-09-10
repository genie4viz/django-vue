import React, {Component, PropTypes} from "react"
import {Field, FieldArray} from "redux-form"

import {InputField, SelectField} from "../fields/genericField.jsx"
import * as CONSTANTS from '../constants/constants.js'

const errorMsgStyle = {
  color: '#9F3A38',
}

export const renderContactFields = ({ fields, meta: {touched, error} }) => (
	<ul>

		<li className="inline fields">
			<button className="ui button" onClick={() => fields.push({})}>Ajouter contact</button>
			{ error && <span style={errorMsgStyle}>{error}</span> }
		</li>

		{fields.map((contact, index) => {
			return (
				<li className="inline fields" key={index}>
					<Field
						name={`${contact}.value`}
						component={InputField}
						/>
					<Field
						name={`${contact}.type`}
						component={SelectField}
						options={[
							{id: "Courriel", name: "Courriel"},
							{id: "Site Internet", name: "Site Internet"},
							{id: "Téléphone", name: "Téléphone"}
						]}/>
					<button className="ui red tiny button" onClick={() => fields.remove(index)}>Enlever</button>
				</li>
			)
		})}
	</ul>
)
