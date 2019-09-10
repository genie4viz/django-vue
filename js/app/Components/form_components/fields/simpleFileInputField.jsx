import React, {Component, PropTypes} from "react"
import {Field} from "redux-form"
import {InputField, FileInputField} from "./genericField.jsx"

const imageGalleryStyles = {
  display: 'flex',
  flexWrap: 'wrap'
}

export const SimpleFileFields = ({fields, meta: {touched, error}}) => {
    return (
      <div>
        <ul style={imageGalleryStyles}>
            {
                fields.map((image, index) => {
                    return (
                        <li key={index} className="grouped fields">
                            <Field
                                name={`${image}.image_type`}
                                component={InputField}
                                type="hidden"
                                value="photo"
                                />
                            <Field
                                id={`${image}.image`}
                                name={`${image}.image`}
                                component={FileInputField}
                                label={
                                    <label
                                        htmlFor={`${image}.image`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                                          <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
                                        </svg>
                                        <span>Choisissez une photo&hellip;</span>
                                    </label>
                                }
                                />
                            <Field
                                name={`${image}.credit`}
                                component={InputField}
                                placeholder="Entrez vos crédits photo"
                                inline={true}
                                />
                            <div className="field">
                                <button
                                    className="ui red tiny button"
                                    onClick={() => fields.remove(index)}
                                    >
                                    Effacer
                                </button>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
        <button className="ui button" onClick={() => fields.push({image_type: "photo"})}>Ajouter une image</button>
      </div>
    )
}
