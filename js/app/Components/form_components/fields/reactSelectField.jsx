import React, {Component, PropTypes} from "react"
import Select from "react-select"
import classNames from "classnames"

const ReactSelectFieldPropTypes = {
  className: PropTypes.string,
  input: PropTypes.object,
  placeholder: PropTypes.element,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool
}

const ReactSelectFieldDefaultProps = {
  searchable: false,
  clearable: false
}

//component for activity field: TODO put dispatch an action dynamically inside Select
// component={props => {
//     return <Select
//
//         onChange={
//             value => {
//                 props.input.onChange(value.value)
//                 dispatch(selectDynamicLayer(value.label)) //DynamicLayer is used to select different layers of trails depending on the sport type
//         }}/>
// }}

export const ReactSelectField = props => {
  const {
    input: {name, value, onChange},
    placeholder,
    options,
    className,
    clearable,
    searchable
  } = props

  return <Select
    className={className}
    name={props.input.name}
    value={props.input.value}
    onChange={ obj => {
                        if(props.input.name === "search_term") {
                            onChange(obj.label)
                        } else {
                          onChange(obj.value)
                        }
                      }
              }
    placeholder={placeholder}
    options={props.options}
    clearable={clearable}
    searchable={searchable}/>
}

ReactSelectField.propTypes = ReactSelectFieldPropTypes
ReactSelectField.defaultProps = ReactSelectFieldDefaultProps
