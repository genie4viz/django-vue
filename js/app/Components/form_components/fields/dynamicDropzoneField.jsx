import React, {Component, PropTypes} from "react"
import {Field, FieldArray, arrayPush, arrayRemoveAll} from "redux-form"
import Dropzone from "react-dropzone"

const BASE64_REGEX = /([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)/

/******************************************
 * RENDER FUNCTION HELPER FOR FIELDARRAYS *
 ******************************************/
const format = value => {
  if (BASE64_REGEX.test(value)) {
    return value
  } else {
    return window.atob(value)
  }
}

const renderImageFields =  ({ fields, meta: { touched, error }, files = [], handleRemove }) => {
  return (
    <ul>
      {
        fields.map((images, index) => {
          return (
            <li key={index} className="inline fields">
              <div className="field">
                <Field
                  name={`${images}.image_type`}
                  component="input"
                  type="hidden"
                  />
              </div>
              <div className="field">
                <Field
                  name={`${images}.image`}
									format={format}
                  component="input"
                  type="hidden"
                  />
              </div>
              <div className="inline field">
                <img className="ui avatar image" src={files[index].image}/>
                <Field
                  name={`${images}.credit`}
                  component="input"
                  placeholder="Entrez vos crédits"
                  />
              </div>
              <div className="field">
                <button
                  className="ui red tiny button"
                  onClick={() => {
                    fields.remove(index)
                    handleRemove(files, index)
                  }}
                  >
                  Effacer
                </button>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

export class DynamicDropzoneField extends Component {
  static defaultProps = {
    name: "images"
  }

  constructor(props) {
    super(props)

    this.state = {
      files: [],
      message: "Ajoutez vos photos ici!"
    }
  }

  componentWillMount() {
    const {files} = this.props
    if (files) {
      this.setState({files: files})
    }
  }

  render() {
    const {files, message} = this.state
    return (
      <div className="field">
        <label>Images</label>
        <Dropzone
          className="dropzone"
          onDrop={this.handleDrop}
          accept={this.props.accept}
          >
          <div>{message}</div>
        </Dropzone>
        <FieldArray
          name='images'
          component={renderImageFields}
          files={files}
          handleRemove={this.handleRemove}
          />
      </div>
    )
  }

  handleDrop = files => {
    if (files.length > 10) {
      this.setState({message: "Vous ne pouvez pas charger plus de 10 images."})
    } else {
      this._processImage(files)
    }
  }

  handleRemove = (files, index) => {
    let temp = files.slice(0, index).concat(files.slice(index+1))
    this.setState({files: temp})
  }

  _prepImages = (file, data) => {
    return {
      image_type: "photo",
      image: data,
      credit: "",
      preview: file.preview
    }
  }

  _processImage = (files) => {
    const {dispatch, form} = this.props
    files.map(file => {
      let reader = new FileReader()
      let self = this
      reader.readAsDataURL(file)
      reader.onload = function() {
        let temp = [...self.state.files, self._prepImages(file, this.result)]
        self.setState({files: temp})
        dispatch(arrayRemoveAll(form, "images"))
        temp.map(item => dispatch(arrayPush(form, "images", item)))
      }
      reader.onerror = error => {
        console.log("Error: ", error);
      }
    })
  }
}
