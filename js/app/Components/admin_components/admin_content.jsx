import React, {Component, PropTypes, PureComponent} from "react"
import {connect} from "react-redux"
import Fuse from "fuse.js"
import {isEmpty as _Empty} from "lodash/fp"
import debounce from "lodash/debounce"

import {AdminMap} from "../../Components/form_components/fields/adminMap.jsx"
import TrailSectionForm from "../../Components/form_components/trailsectionForm.jsx"

import { push } from  "react-router-redux";

import {
    NewTrailItem,
    EditTrailItem,
    NewLocationItem,
    EditLocationItem,
    EditProfileItem,
    NewTrailSectionItem,
    EditTrailSectionItem
} from "../admin_components/admin_items.jsx"

import {FuzzyFilter} from "../basic_components/fuzzyFilter.jsx"
import Button from "../basic_components/buttons.jsx"

import {
  getUserTrails,
  getUserLocations,
  getUserTrailSectionsByLocations,
  filterByRegions,
  orderCollection
} from "../../Actions/admin_actions.js"

import * as FormatUtils from "../utils/utils.js"

import {not} from "../../Utils/boolean.js"
import { parseAdminLocations } from "../utils/utils"

const compareState = (value, nextValue) => JSON.stringify(value) === JSON.stringify(nextValue)

const locationsAreaMapStateToProps = state => {
    return {
        username: state.user.profile.username,
        locations: state.user.locations
    }
}

const locationsAreaMapDispatchToProps = dispatch => {
    return {
        dispatch,
        getUserLocations: username => dispatch(getUserLocations(username)),
        orderCollection: (collection, field, order) => dispatch(orderCollection(collection, field, order)),
    }
}

export class LocationsArea extends PureComponent {
    constructor(props) {
        super(props)

        this.fuseConfig = {
          keys: ["location_id", "name",]
        }

        this.state = {
            locations: [],
            filtered_locations: [],
        }

        this.handleDataFiltering = this.handleDataFiltering.bind(this)
        this.handleCollectionOrdering = this.handleCollectionOrdering.bind(this)
    }

    componentDidMount() {
        const {username, locations, getUserLocations} = this.props
        if(_Empty(locations) || null || undefined) {
            getUserLocations(username)
            // .then(trails => this.setState({
            //     trails: trails.data.results || trails.data,
            //     filtered_trails: trails.data.results || trails.data,
            // }))
            // } else {
            // this.setState({
            //     trails: trails.results || trails,
            //     filtered_trails: trails.results || trails
            // })
        }
    }

    render() {
        const {
            dispatch,
            locations,
            sitePath
        } = this.props

        return (
            <div className="profile-content">
                <FuzzyFilter
                    fluid
                    onInputChange={this.handleDataFiltering}
                    items={locations}
                    collection={"locations"}
                    />
                <div className="ui divided items">
                    <NewLocationItem sitePath={sitePath}/>
                    {
                        locations
                        && locations
                        .map((element, index) => <EditLocationItem sitePath={sitePath} key={element.id} id={element.id}/>)
                    }
                </div>
            </div>
        )
    }

    handleCollectionOrdering(collection, field) {
        return event => {
            this.props.orderCollection('locations', 'last_modified', e.target.value)
        }
    }

    handleDataFiltering(event) {
        event.persist()
        this._handleDataFiltering(event)
    }

    _handleDataFiltering = debounce((event) => {
        let value = event.target.value
        let data = this.state.locations
        if(not(value.length===0)) {
            let fuse = new Fuse(data, this.fuseConfig)
            let filtered_data = fuse.search(value)
            this.setState({filtered_locations: filtered_data})
        } else {
            this.setState({filtered_locations: data})
        }
    }, 1000)
}

LocationsArea = connect(
    locationsAreaMapStateToProps,
    locationsAreaMapDispatchToProps
)(LocationsArea)

/******************
 *   TRAIL AREA   *
 ******************/

const mapStateToProps = state => {
    return {
        username: state.user.profile.username,
        trails: state.user.trails
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        getUserTrails: username => dispatch(getUserTrails(username)),
        orderCollection: (collection, field, order) => dispatch(orderCollection(collection, field, order)),
    }
}

export class TrailsArea extends PureComponent {
    constructor(props) {
        super(props)

        this.fuseConfig = {
          keys: ["trail_id", "name", "difficulty", "location_name"]
        }

        this.state = {
            trails: [],
            filtered_trails: [],
        }

        this.handleDataFiltering = this.handleDataFiltering.bind(this)
        this.handleCollectionOrdering = this.handleCollectionOrdering.bind(this)
    }

    componentDidMount() {
        const {username, trails, getUserTrails} = this.props
        if(trails == null) {
            getUserTrails(username)
                .then(trails => {
                    this.setState({trails: trails.data, filtered_trails: trails.data,})
                })
        } else {
            this.setState({
                trails: trails,
                filtered_trails: trails
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const {trails} = this.state
        if (trails
          && not(compareState(trails, nextProps.trails))) {
            this.setState({
                trails: nextProps.trails,
                filtered_trails: nextProps.trails,
            })
        }
    }


    render() {
        const {
            dispatch,
            trails,
            sitePath
        } = this.props
        const {filtered_trails} = this.state

        return (
            <div className="profile-content">
                <FuzzyFilter
                    fluid
                    onInputChange={this.handleDataFiltering}
                    action={
                        <select
                        className="ui compact selection dropdown"
                        onChange={this.handleCollectionOrdering("trails", "last_modified")}
                        >
                        <option className="item" value="ASC">Date ascendante</option>
                        <option className="item" value="DESC">Date descendante</option>
                    </select>
                    }/>
                <div className="ui divided items">
                    <NewTrailItem sitePath={sitePath}/>
                    {
                        filtered_trails
                        && filtered_trails
                            .map((element, index) => <EditTrailItem sitePath={sitePath} key={element.id} id={element.id}/>)
                    }
                </div>
            </div>
        )
    }

    handleCollectionOrdering(collection, field) {
        return event => {
            this.props.orderCollection(collection, field, event.target.value)
        }
    }

    handleDataFiltering(event) {
        event.persist()
        this._handleDataFiltering(event)
    }

    _handleDataFiltering = debounce((event) => {
        let value = event.target.value
        let data = this.state.trails
        if(not(value.length===0)) {
            let fuse = new Fuse(data, this.fuseConfig)
            let filtered_data = fuse.search(value)
            this.setState({filtered_trails: filtered_data})
        } else {
            this.setState({filtered_trails: data})
        }
    }, 500)
}

TrailsArea = connect(mapStateToProps, mapDispatchToProps)(TrailsArea)

/*************************
 *   TRAILSECTION AREA   *
 *************************/
 const trailsectionAreaMapStateToProps = state => {
     return {
         username: state.user.profile.username,
         locations: state.user.locations,
         trailsections: state.user.trailsections
     }
 }

 // const trailsectionAreaMapDispatchToProps = dispatch => {
 //    return {
 //        dispatch,
 //        getUserTrailSectionsByLocations: location_id => dispatch(getUserTrailSectionsByLocations(location_id))
 //    }
 // }

export class TrailSectionsArea extends PureComponent {
    constructor(props) {
      super(props)
    }

    // componentDidMount() {
    //   const {locations, trailsections, getUserTrailSectionsByLocations} = this.props
    //
    //   /* locations: array of location IDs*/
    //   getUserTrailSectionsByLocations(parseAdminLocations(locations))
    // }

    render() {
      const {trailsections, locations, sitePath, dispatch} = this.props
      return (
          <div className="ui divided items">
              <div className="edit-form__map">
                <AdminMap trailsections={trailsections} locations={locations} sitePath={sitePath}/>
              </div>
          </div>
      )
    }
}

TrailSectionsArea = connect(trailsectionAreaMapStateToProps)(TrailSectionsArea)

/**
 * PROFILE AREA
 * @param {*} param0
 */
export const ProfileArea = props => {
    //TODO add password change form
    return (
        <div className="profile-content">
            <div className="ui divided items">
                <EditProfileItem/>
            </div>
        </div>
    )
}
