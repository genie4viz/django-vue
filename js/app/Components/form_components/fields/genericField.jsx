import React, {Component, PropTypes} from "react"
import {reduxForm, Field} from "redux-form"
import {FieldState} from "../states/formStates.js"
import {not} from "../../../Utils/boolean.js"

import Textarea from 'react-textarea-autosize';

const errorMsgStyle = {
  color: '#9F3A38'
}

const commonProps = {
    className: PropTypes.string,
    error: PropTypes.any,
    input: PropTypes.object,
    label: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.element,
    ]).isRequired,
    touched: PropTypes.bool,
    disabled: PropTypes.bool,
    inline: PropTypes.bool,
    meta: PropTypes.object,
    placeholder: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
    readonly: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    required: PropTypes.bool,
    type: PropTypes.string,
}

const commonDefaultProps = {
    className: '',
    disabled: false,
    inline: false,
    label: false,
    placeholder: '',
    readonly: false,
    required: false,
    type: 'text'
}

/**
 * NORMAL INPUT FIELD
 */
const InputFieldProps = {labelPosition: PropTypes.string,}
const InputFieldDefaultProps = {labelPosition: 'top', min: false}

export const InputField = props => {
    const {
        className,
        disabled,
        inline,
        input,
        label,
        labelPosition,
        meta: { touched, error },
        min,
        placeholder,
        readonly,
        required,
        type,
        name
    } = props
    let classes = FieldState(inline)(disabled)(error && touched)(required)
    return (
        <div className={`${className} ${classes}`}>
            {labelPosition.includes('top') && label}
            <div className="field">
              <input {...input} name={name} type={type} placeholder={placeholder} readOnly={readonly} min={min}/>

            </div>
            {labelPosition.includes('bottom') && label}
            {
                touched &&
                error &&
                <div>
                  <p style={errorMsgStyle}>{error}</p>
                </div>
            }
        </div>
    )
}

InputField.propTypes = {...commonProps, ...InputFieldProps}
InputField.defaultProps = {...commonDefaultProps, ...InputFieldDefaultProps}


/**
 * CHECKBOX INPUT FIELD
 */
export const CheckboxField = props => {
    const {
        className,
        disabled,
        inline,
        input,
        label,
        meta: { touched, error },
        placeholder,
        readonly,
        required,
        type
    } = props
    let classes = FieldState(inline)(disabled)(error && touched)(required)
    return (
        <div className={`${className} ${classes}`}>
            <div className="ui checkbox">
                <input {...input} type={type} placeholder={placeholder} readOnly={readonly}/>
                {label}
            </div>
        </div>
    )
}

CheckboxField.propTypes = commonProps
CheckboxField.defaultProps = commonDefaultProps

/* CHECKBOX GROUP */

export class CheckboxGroup extends Component {

  field = ({input, meta, options}) => {

      const { name, onChange } = input;
      const { touched, error } = meta;
      const inputValue = input.value;

      const checkboxes = options.map( ({label, value}, index) => {

        const handleChange = (event) => {
          const arr = [...inputValue];
          if(event.target.checked) {
            arr.push(value);
          } else {
            arr.splice(arr.indexOf(value), 1);
          }
          return onChange(arr);
        };
        const checked = inputValue.includes(value);
        return (
          <li>
          <label key={`checkbox-${index}`}>
            <input type="checkbox" name={`${name}[${index}]`} value={value} checked={checked} onChange={handleChange} />
            <span>{label}</span>
          </label>
          </li>
        );
      });

      return(
        <div>
          <ul>{checkboxes}</ul>
          {touched && error && <p className="error">{error}</p>}
        </div>
      );

    };

    render() {
      return <Field {...this.props} type="checkbox" component={this.field} />;
    }

}

/**
 * TEXTAREA FIELD
 */
const TextAreaFieldProps = {
    rows: PropTypes.string.isRequired,
}

export const TextAreaField = props => {
    const {
        className,
        disabled,
        inline,
        input,
        label,
        meta: { touched, error },
        placeholder,
        readonly,
        required,
        rows,
        type,
        name
    } = props
    let classes = FieldState(inline)(disabled)(error && touched)(required)
    return (
        <div className={`${className} ${classes}`}>
            {label}
            <Textarea {...input} name={name} placeholder={placeholder}/>
            {
                touched &&
                error &&
                <div>
                    <p style={errorMsgStyle}>{error}</p>
                </div>
            }
        </div>
    )
}

TextAreaField.propTypes = {...commonProps, ...TextAreaFieldProps}
TextAreaField.defaultProps = commonDefaultProps


/**
 * SELECT FIELD
 */
const SelectFieldProps = {
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export const SelectField = props => {
    const {
        className,
        disabled,
        inline,
        input,
        label,
        labelPosition,
        meta: { touched, error },
        options,
        placeholder,
        readonly,
        required,
        rows,
        name
    } = props
    let classes = FieldState(inline)(disabled)(error && touched)(required)
    return (
        <div className={`${className} ${classes}`}>
            {label}
            <select
                name={name}
                {...input}
                required={required}
                >
                <option value="" disabled>Sélectionner un champ...</option>
                {
                    options.map((current, index) => {
                        return <option key={index} value={current.id}>{current.name}</option>
                    })
                }
            </select>
            {
                touched &&
                error &&
                <div>
                    <p style={errorMsgStyle}>{error}</p>
                </div>
            }
        </div>
    )
}

SelectField.propTypes = {...commonProps, ...SelectFieldProps}
SelectField.defaultProps = commonDefaultProps

/**
 * INPUT FIELD
 */
const FileInputFieldProps = {id: PropTypes.string,}
const FileInputFieldDefaultProps = {id: ""}

export class FileInputField extends Component {
    constructor(props) {
        super(props)
    }

    onChange(e) {
        const { input: {onChange} } = this.props
        let self = this,
            file = e.target.files[0],
            reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
            onChange(this.result)
            self.setState({preview: this.result})
        }
        reader.onerror = error => {
            console.log("Error: ", error);
        }
    }

    render() {
        const {
            id,
            className,
            disabled,
            inline,
            input: {value},
            label,
            labelPosition,
            meta: { touched, error },
            placeholder,
            readonly,
            required,
            type
        } = this.props
        let classes = FieldState(inline)(disabled)(error && touched)(required)
        return (
            <div className={`${className} ${classes}`}>
                <input
                    className="file-input file-input--1"
                    id={id}
                    type="file"
                    value={undefined}
                    onChange={this.onChange.bind(this)}
                    />
                {label}
                {value && <img className="ui medium image" src={value}/>}
            </div>
        )
    }
}

FileInputField.propTypes = {...commonProps, ...FileInputFieldProps}
FileInputField.defaultProps = {...commonDefaultProps, ...FileInputFieldDefaultProps}
