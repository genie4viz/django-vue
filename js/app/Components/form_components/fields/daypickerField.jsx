import React, {Component, PropTypes} from "react"
import DayPicker, { DateUtils } from "react-day-picker"
import MomentLocaleUtils from "react-day-picker/moment"
import moment from 'moment';

import "moment/locale/fr-ca"

const defaultProps = {
  input: {
    disabledDays: () => false,
    handleDayClick: (e, day) => console.log(day)
  }
}

export const DayPickerField = field => {
  const {
          error,
          input: {
            handleDayClick,
            value,
            onChange
          },
          touched
      } = field

  return (
    <DayPicker
      fixedWeeks
      locale="fr-ca"
      localeUtils={MomentLocaleUtils}
      onDayClick={
        (...args) => {
          onChange(handleDayClick(value, ...args))
        }
      }
      selectedDays={day => DateUtils.isDayInRange(day, value)}
      {...field.input}
      />
  )
}

DayPickerField.defaultProps = defaultProps
