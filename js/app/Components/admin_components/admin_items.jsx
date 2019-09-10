import React, {Component, PropTypes} from "react"
import ui from "redux-ui"
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Field, reduxForm, submit, change} from "redux-form"

import ProfileForm from "../form_components/profileForms.jsx"
import TrailForm from "../form_components/trailForm.jsx"
import LocationForm from "../form_components/locationForm.jsx"
import TrailSectionForm from "../form_components/trailsectionForm.jsx"
import {Header} from "../basic_components/header.jsx"
import ProfileWidget from "../profile_components/profileWidget.jsx"


import * as Modal from '../basic_components/modal.jsx'
import Button from '../basic_components/buttons.jsx'
import EditableItem, {Content} from '../basic_components/editableItem.jsx'
import { getSportsType } from '../utils/utils.js'

import {SITE_PATH} from "../../config.jsx"

import {
    submitTrailModifications,
    submitLocationModifications,
    submitCreateNewLocation,
    submitCreateNewTrail,
    submitDeleteTrail,
    submitDeleteLocation,
    submitProfileModifications,
} from "../../Actions/admin_actions.js"

import {extraUIReducer} from '../../Reducers/ui_reducer.js'
import {itemSelector} from '../../Selectors/adminSelector.js'

import * as FormatUtils from "../utils/utils.js"

import {not} from '../../Utils/boolean.js'

const isToBeDeleted = (toBeDeleted = false) => {
    return classNames(
        'ui',
        {'disabled': toBeDeleted},
        'button')
}

/**************************
 * IMPLEMENTATION CLASSES *
 **************************/

const editUiState = {
  state: {
    editing: null,
    isModalOpen: false
  },
  reducer: extraUIReducer
}

/**
 * TrailItems
 */
const trailMapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
        submitUpdateTrail: formData => dispatch(submitTrailModifications(formData)),
        submitCreateTrail: formData => dispatch(submitCreateNewTrail(formData)),
        submitDeleteTrail: id => dispatch(submitDeleteTrail(id)),
    }
}

export class NewTrailItem extends Component {
    constructor(props) {
        super(props)

        this.defaultValues = {
            object_type: "Trail",
            path_type: '1',
            activities: [
                true
            ],
            description: '',
            difficulty: '1',
            images: []
        }

        this.handleEditing = this.handleEditing.bind(this)
        this.handleModalToggle = this.handleModalToggle.bind(this)
    }

    render() {
        const {
            dispatch,
            submitCreateTrail,
            userLocations,
            userPermissions,
            locations,
            trailsections,
            ui: {editing, isModalOpen},
            sitePath
        } = this.props
        const defaultValues = this.defaultValues
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <Button onClick={this.handleEditing}>Nouveau</Button>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <Header location={sitePath} children={<ProfileWidget />}/>
                        <div className="description">
                            <TrailForm
                                userLocations={userLocations}
                                userPermissions={userPermissions}
                                onSubmit={submitCreateTrail}
                                initialValues={defaultValues}
                                locations={locations}
                                trailsections={trailsections}/>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit("trail-data-form"))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }/>
        );
    }

    handleModalToggle() {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing() {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

NewTrailItem = ui(editUiState)(NewTrailItem)

NewTrailItem = connect(
    (state, ownProps) => {
    return {
        userLocations: state.user.profile.parks,
        userPermissions: state.user.profile.admin_type,
        trailsections: state.user.trailsections,
        locations: state.user.locations
    }
}, trailMapDispatchToProps)(NewTrailItem)


/**
 * Edit Trail Item
 */
export class EditTrailItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            defaultValues: {
                object_type: "Trail",
                path_type: '1',
                activities: [
                    true
                ],
                description: '',
                difficulty: '1',
                images: []
            }
        }

        this.handleEditing = this.handleEditing.bind(this)
        this.handleModalToggle = this.handleModalToggle.bind(this)
    }

    render() {
        const {
            dispatch,
            submitUpdateTrail,
            submitDeleteTrail,
            userLocations,
            userPermissions,
            trailsections,
            trail,
            locations,
            ui: {editing, isModalOpen},
            isLoadingTrailForm,
            sitePath
        } = this.props
        const {defaultValues} = this.state
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <h2>{trail.name}</h2>
                        <div className="meta">
                            <p>
                              <strong>Types d&apos;activités:</strong>
                              &nbsp;
                              {getSportsType(trail.activity)}
                            </p>
                            <p>
                                <strong>Dernières modifications:</strong>
                            &nbsp;
                            {trail.last_modified}
                            </p>
                            <p>
                                <strong>Réseau:</strong>
                                &nbsp;
                                {trail.location_name}
                            </p>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <button className="ui button"><Link
                                    style={{backgroundColor: '#7ec450'}}
                                    to={`/hikes/${trail.id}/`}
                                    target="_blank"
                                    >
                                        Voir la fiche en ligne
                                </Link></button>
                                <Button isLoadingForm={isLoadingTrailForm} onClick={this.handleEditing}>Editer</Button>
                            </div>
                        </div>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <div className="description">

                          <Header location={sitePath} children={<ProfileWidget />}/>
                            <TrailForm
                                key={`trail-${trail.id}-form`}
                                form={`trail-${trail.id}-form`}
                                userLocations={userLocations}
                                userPermissions={userPermissions}
                                trailsections={trailsections}
                                locations={locations}
                                onSubmit={submitUpdateTrail}
                                initialValues={trail}/>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit(`trail-${trail.id}-form`))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                                <Button
                                    color='red'
                                    onClick={this.handleModalToggle}
                                    >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }
                ConfirmationDialog={
                    <Modal.ModalComponent
                        active={isModalOpen}
                        basic={true}
                        >
                        <Modal.ModalContent title={<h3>Voulez-vous vraiment supprimer cet élément?</h3>}>
                            <p>Cet élément sera supprimé et ne sera plus diffusé sur le site. Voulez-vous continuer?</p>
                            <Modal.ModalActions>
                                <Button
                                    negative
                                    onClick={submitDeleteTrail.bind(null, trail.id)}
                                    >
                                    Oui
                                </Button>
                                <Button
                                    onClick={this.handleModalToggle}
                                    >
                                    Non
                                </Button>
                            </Modal.ModalActions>
                        </Modal.ModalContent>
                    </Modal.ModalComponent>
                }/>
        );
    }

    handleModalToggle() {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing() {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

EditTrailItem = ui(editUiState)(EditTrailItem)

EditTrailItem = connect(
    (state, ownProps) => {
        const trail = itemSelector(state, 'trails', ownProps.id)
        return {
            trail,
            userLocations: state.user.profile.parks,
            userPermissions: state.user.profile.admin_type,
            trailsections: state.user.trailsections,
            locations: state.user.locations,
            isLoadingTrailForm: state.form ? false : true
        }
}, trailMapDispatchToProps)(EditTrailItem)


/********************
 *  Location Items  *
 ********************/

/**
 * New Location Item
 */
const locationMapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch,
        submitUpdateLocation: formData => dispatch(submitLocationModifications(formData)),
        submitCreateLocation: formData => dispatch(submitCreateNewLocation(formData)),
        submitDeleteLocation: id => dispatch(submitDeleteLocation(id)),
    }
}

export class NewLocationItem extends Component {
    constructor(props) {
        super(props)

        const defaultValues = {
            object_type: "Location",
            dog_allowed: false,
            type: 11,
            contact: [{value: this.props.userEmail, type:'Courriel'}],
            exploitation_periods: [],
            fare_note: '',
            address: {
                country: "Canada"
            },
            images: []
        }

        this.handleEditing = this.handleEditing.bind(this)
        this.handleModalToggle = this.handleModalToggle.bind(this)
    }

    render() {
        const {
            dispatch,
            submitCreateLocation,
            ui: {editing, isModalOpen},
            sitePath
        } = this.props
        const defaultValues = this.defaultValues
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <Button onClick={this.handleEditing}>Nouveau</Button>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <Header location={sitePath} children={<ProfileWidget />}/>
                        <div className="description">
                            <LocationForm
                                onSubmit={submitCreateLocation}
                                initialValues={defaultValues}
                                />
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit("location-data-form"))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }/>
        );
    }

    handleModalToggle() {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing() {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

NewLocationItem = ui(editUiState)(NewLocationItem)

NewLocationItem = connect((state, ownProps) => {
    return {
        userEmail: state.user.profile.email,
    }
}, locationMapDispatchToProps)(NewLocationItem)


/**
 * Edit Location Item
 */

export class EditLocationItem extends Component {
    constructor(props) {
        super(props)

        this.defaultValues = {
            object_type: "Trail",
            path_type: '1',
            activities: [
                true
            ],
            description: '',
            difficulty: '1',
            images: []
        }

        this.handleEditing = this.handleEditing.bind(this)
        this.handleModalToggle = this.handleModalToggle.bind(this)
    }

    render() {
        const {
            dispatch,
            submitUpdateLocation,
            submitDeleteLocation,
            location,
            ui: {editing, isModalOpen},
            sitePath
        } = this.props

        const defaultValues = this.defaultValues

        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <h2>{location.name}</h2>
                        <div className="meta">
                            <strong>Dernières modifications:</strong>
                            &nbsp;
                            {location.last_modified}
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <button className="ui button"><Link
                                    style={{backgroundColor: '#7ec450'}}
                                    to={`/locations/${location.id}/`}
                                    target="_blank"
                                    >
                                        Voir la fiche en ligne
                                </Link></button>
                                <Button disabled={location.deletion_pending} onClick={this.handleEditing}>Editer</Button>
                            </div>
                        </div>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <Header location={sitePath} children={<ProfileWidget />}/>

                        <div className="description">
                            <LocationForm
                                key={`location-${location.id}-form`}
                                form={`location-${location.id}-form`}
                                onSubmit={submitUpdateLocation}
                                initialValues={location}/>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button onClick={() => dispatch(submit(`location-${location.id}-form`))}>Sauvegarder</Button>
                                <Button onClick={this.handleEditing}>Annuler</Button>
                                <Button
                                    color='red'
                                    onClick={this.handleModalToggle}
                                    >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }
                ConfirmationDialog={
                    <Modal.ModalComponent
                        active={isModalOpen}
                        basic={true}
                        >
                        <Modal.ModalContent title={<h3>Voulez-vous vraiment supprimer cet élément?</h3>}>
                            <p>Cet élément sera supprimé et ne sera plus diffusé sur le site. Voulez-vous continuer?</p>
                            <Modal.ModalActions>
                                <Button
                                    negative
                                    onClick={submitDeleteLocation.bind(null, location.id)}
                                    >
                                    Oui
                                </Button>
                                <Button
                                    onClick={this.handleModalToggle}
                                    >
                                    Non
                                </Button>
                            </Modal.ModalActions>
                        </Modal.ModalContent>
                    </Modal.ModalComponent>
                }/>
        );
    }

    handleModalToggle() {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing() {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

EditLocationItem = ui(editUiState)(EditLocationItem)

EditLocationItem = connect(
    (state, ownProps) => {
        const location = itemSelector(state, 'locations', ownProps.id)
        return {
            location
        }
}, locationMapDispatchToProps)(EditLocationItem)


/**
 * Profile
 */
const profileMapStateToProps = state => {
    return {
        user: state.user
    }
}

const profileMapDispatchToProps = dispatch => {
    return {
        dispatch,
        submitUpdateProfile: formData => dispatch(submitProfileModifications(formData)),
    }
}

export class EditProfileItem extends Component {
    constructor(props) {
        super(props)

        this.handleEditing = this.handleEditing.bind(this)
        this.handleModalToggle = this.handleModalToggle.bind(this)
    }

    render() {
        const {
            dispatch,
            submitUpdateProfile,
            ui: {editing},
            user
        } = this.props
        const {id, email, first_name, last_name, description, username, address, organisation, organisation_contact} = user.profile
        const userInfos = {
            id,
            email,
            username,
            first_name,
            last_name,
            organisation,
            organisation_contact,
            address
        }
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <h2>{`${first_name} ${last_name}`}</h2>
                        <div className="meta">
                            {organisation}
                        </div>
                        <div className="description">
                            <ul>
                                <li><strong>Courriel:</strong>&nbsp;{email}</li>
                                <li><strong>Téléphone:</strong>&nbsp;{organisation_contact}</li>
                            </ul>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button onClick={this.handleEditing}>Editer</Button>
                            </div>
                        </div>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <div className="description">
                            <ProfileForm
                                initialValues={userInfos}
                                onSubmit={submitUpdateProfile}
                                />
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit("profile-data-form"))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }/>
        );
    }

    handleModalToggle() {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing() {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

EditProfileItem = ui(editUiState)(EditProfileItem)

EditProfileItem = connect(profileMapStateToProps, profileMapDispatchToProps)(EditProfileItem)

/* Implenting TrailSection Page */

/*****************************/
/*  create new TrailSection  */
/*****************************/
const trailsectionMapDispatchToProps = (dispatch, ownProps) => {
    // return {
    //     dispatch,
    //     submitUpdateTrailSection: formData => dispatch(submitTrailSectionModifications(formData)),
    //     submitCreateTrailSection: formData => dispatch(submitCreateNewTrailSection(formData)),
    //     submitDeleteTrailSection: id => dispatch(submitDeleteTrailSection(id)),
    // }
}

export class NewTrailSectionItem extends Component {
    constructor(props) {
        super(props)

        this.defaultValues = {
            // object_type: "TrailSection",
            // path_type: '1',
            // activities: [
            //     true
            // ],
            // description: '',
            // difficulty: '1',
            // images: []
        }
    }

    render() {
        const {
            ui: {editing, isModalOpen},
            sitePath
        } = this.props
        const defaultValues = this.defaultValues
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <Button onClick={this.handleEditing}>Nouveau</Button>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <Header location={sitePath} children={<ProfileWidget />}/>
                        <div className="description">
                            <TrailSectionForm />
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit("trailsection-data-form"))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }/>
        );
    }

    handleModalToggle = () => {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing = () => {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

NewTrailSectionItem = ui(editUiState)(NewTrailSectionItem)

NewTrailSectionItem = connect(
    (state, ownProps) => {
    return {
        userLocations: state.user.profile.parks,
        userPermissions: state.user.profile.admin_type
    }
}, trailsectionMapDispatchToProps)(NewTrailSectionItem)

/*****************************/
/*  edit a TrailSection  */
/*****************************/
export class EditTrailSectionItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            dispatch,
            submitUpdateTrailSection,
            submitDeleteTrailSection,
            userLocations,
            userPermissions,
            trailsection,
            ui: {editing, isModalOpen},
            sitePath
        } = this.props
        const {defaultValues} = this.state
        return (
            <EditableItem
                editing={editing}
                ContentComponent={
                    <Content>
                        <h2>{trailsection.name}</h2>
                        <div className="meta">
                            <p>
                              <strong>Types d&apos;activités:</strong>
                              &nbsp;
                              {getSportsType(trailsection.activity)}
                            </p>
                            <p>
                                <strong>Dernières modifications:</strong>
                            &nbsp;
                            {trailsection.date_insert}
                            </p>
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button onClick={this.handleEditing}>Editer</Button>
                            </div>
                        </div>
                    </Content>
                    }
                EditComponent={
                    <Content>
                        <div className="description">

                          <Header location={sitePath} children={<ProfileWidget />}/>
                            <TrailSectionForm
                            />
                        </div>
                        <div className="extra">
                            <div className="ui buttons right floated">
                                <Button
                                    onClick={() => dispatch(submit(`trail-${trail.id}-form`))}
                                    >
                                    Sauvegarder
                                </Button>
                                <Button onClick={this.handleEditing}>
                                    Annuler
                                </Button>
                                <Button
                                    color='red'
                                    onClick={this.handleModalToggle}
                                    >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </Content>
                    }
                ConfirmationDialog={
                    <Modal.ModalComponent
                        active={isModalOpen}
                        basic={true}
                        >
                        <Modal.ModalContent title={<h3>Voulez-vous vraiment supprimer cet élément?</h3>}>
                            <p>Cet élément sera supprimé et ne sera plus diffusé sur le site. Voulez-vous continuer?</p>
                            <Modal.ModalActions>
                                <Button
                                    negative
                                    onClick={submitDeleteTrailSection.bind(null, trail.id)}
                                    >
                                    Oui
                                </Button>
                                <Button
                                    onClick={this.handleModalToggle}
                                    >
                                    Non
                                </Button>
                            </Modal.ModalActions>
                        </Modal.ModalContent>
                    </Modal.ModalComponent>
                }/>
        );
    }

    handleModalToggle = () => {
        if (this.props.ui.isModalOpen) {
            this.props.updateUI({isModalOpen: false})
        } else {
            this.props.updateUI({isModalOpen: true})
        }
    }

    handleEditing = () => {
        const {ui, updateUI} = this.props
        if (ui.editing === null || ui.editing === false) {
            updateUI({
                editing: true
            })
        } else {
            updateUI({
                editing: false
            })
        }
    }
}

EditTrailSectionItem = ui(editUiState)(EditTrailSectionItem)

EditTrailSectionItem = connect(
    (state, ownProps) => {
        const trailsection = itemSelector(state, 'trailsections', ownProps.trailsection_id)
        return {
        }
}, trailMapDispatchToProps)(EditTrailSectionItem)
