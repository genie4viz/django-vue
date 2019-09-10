import React, {Component, PropTypes} from "react"
import classNames from 'classnames'

const createElementStateClass = (editing) => {
  return classNames(
      "item", 
      "profile-item",
      {"profile-item--edit": editing})
}

const createDeletionPendingClass = (toBeDeleted = false) => {
    return classNames(
        'ui',
        {'disabled': toBeDeleted},
        'button')
}

export const Content = props => {
    return (
        <div className="content">{props.children}</div>
    )
}

const EditableItem = ({editing, ConfirmationDialog, ContentComponent, EditComponent}) => {
    return (
        <div className={createElementStateClass(editing)}>
            {editing ? EditComponent : ContentComponent}
            {ConfirmationDialog ? ConfirmationDialog : false }
        </div>
    )
}

EditableItem.propTypes = {
    editing: PropTypes.any,
    ConfirmationDialog: PropTypes.element,
    ContentComponent: PropTypes.element.isRequired,
    EditComponent: PropTypes.element.isRequired,
}

EditableItem.defaultProps = {
    ConfirmationDialog: <span></span>
}

export default EditableItem