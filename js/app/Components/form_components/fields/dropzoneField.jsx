import React, { Component, PropTypes, } from 'react'
import {Field} from "redux-form"

import Dropzone from 'react-dropzone'

const FILE_FIELD_NAME = 'files'

export const DropzoneField = (field) => {
  const files = field.input.value
  return (
    <div>
      <Dropzone
        className="dropzone"
        name={field.name}
        multiple={false}
        onDrop={( filesToUpload, e ) => field.input.onChange(filesToUpload)}
      >
        <div>Ajoutez vos photos ici</div>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="error">{field.meta.error}</span>}
      {files && Array.isArray(files) && (
        <ul>
          { files.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      )}
    </div>
  )
}
