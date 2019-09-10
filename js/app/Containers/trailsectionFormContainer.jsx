import React, { Component } from 'react'
import { connect } from "react-redux"
import createHistory from 'history/lib/createBrowserHistory'

import { isEmpty } from "lodash/fp"

import TrailSectionForm from "../Components/form_components/trailsectionForm.jsx"
import { Spinner } from "../Components/basic_components/spinner.jsx"
import Button from '../Components/basic_components/buttons.jsx'

import { loadTrailsectionDetails } from "../Actions/trailsection_details_actions.jsx"

import { submit } from "redux-form"

import {
  submitTrailSectionModif,
  submitCreateTrailSection,
  submitDeleteTrailSection,
  getUserTrailSectionsByLocations
} from "../Actions/admin_actions.js"

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchTrailsection: id => dispatch(loadTrailsectionDetails(id)),
    submitTrailSectionModif: formData => dispatch(submitTrailSectionModif(formData)),
    submitCreateTrailSection: formData => dispatch(submitCreateTrailSection(formData)),
    submitDeleteTrailSection: trailsectionId => dispatch(submitDeleteTrailSection(trailsectionId)),
  }
}

class TrailSectionFormContainer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchTrailsection, params } = this.props
    params.trailsectionId ? fetchTrailsection(parseInt(params.trailsectionId)) : null
  }

  goBack = (location) => {
      createHistory().goBack()
  }

  renderLoadingSprite() {
    return <Spinner />
  }

  renderTrailSectionForm() {
    const {trailsectionDetails, location, submitCreateTrailSection, submitTrailSectionModif, dispatch, trailsections, locations, params } = this.props

    let isNewTS = this.props.location.pathname.includes('createnewtrailsection')

    return (
      <div>
          <TrailSectionForm
            onSubmit={ isNewTS ? submitCreateTrailSection : submitTrailSectionModif}
            location={location}
            trailsections={trailsections}
            modifTs={parseInt(params.trailsectionId)}
            locations={locations}
            trailsectionDetails={isNewTS ? null : trailsectionDetails}
            initialValues={isNewTS ? undefined : trailsectionDetails.data}
            />

          <Button type="button" onClick={ () => dispatch(submit("trailsection-data-form")) }> Sauvegarder</Button>
          <Button type="button" onClick={ () => this.goBack(location) } >Annuler</Button>
          { isNewTS ? null : <Button onClick={ () => dispatch(submitDeleteTrailSection(trailsectionDetails.data.trailsection_id)) } color="red">Supprimer</Button> }
      </div>
    )
  }

  render() {
    const { trailsectionDetails, location, params, isFetching } = this.props

    if(location.pathname.includes('createnewtrailsection')) {
      return this.renderTrailSectionForm()
    }

    if (isEmpty(trailsectionDetails.data) || isFetching) {
      return this.renderLoadingSprite()
    } else if (trailsectionDetails.error) {
      console.log('err: ', trailsectionDetails.error)
    } else {
      return this.renderTrailSectionForm()
    }
  }
}

export default TrailSectionFormContainer = connect(
  (state, ownProps) => {
    // const initialValues = state.trailsectionDetails.data
  return {
      isFetching: state.trailsectionDetails[ownProps.isLoading] || state.trailsectionDetails.data.trailsection_id !== parseInt(ownProps.params.trailsectionId),
      trailsectionDetails: state.trailsectionDetails,
      trailsections: state.user.trailsections,
      locations: state.user.locations
  }}, mapDispatchToProps)(TrailSectionFormContainer)
