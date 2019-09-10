import React, {Component, PureComponent, PropTypes} from "react"
import {connect} from "react-redux"
import Tabs from "react-simpletabs"

import { Header } from "../Components/basic_components/header.jsx"
import { Footer } from "../Components/basic_components/footer.jsx"
import { Paginator } from "../Components/basic_components/paginator.jsx"
import ProfileWidget from "../Components/profile_components/profileWidget.jsx"
import { ProfileArea, TrailsArea, LocationsArea, TrailSectionsArea } from "../Components/admin_components/admin_content.jsx"
import { Spinner } from "../Components/basic_components/spinner.jsx"

import {
  getUserLocations,
} from "../Actions/admin_actions.js"
import {fetchPage, PAGINATE_ADMIN} from "../Actions/pagination_actions.jsx"

import {extraUIReducer} from '../Reducers/ui_reducer.js'

import {assert, not, or, and} from "../Utils/boolean.js"

const compareState = (value, nextValue) => JSON.stringify(value) === JSON.stringify(nextValue)

const mapStateToProps = state => {
    return {
      user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
      getUserLocations: username => dispatch(getUserLocations(username))
    }
}

export class AdminPanelContainer extends PureComponent {
    static propTypes = {
        authed: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    }

    constructor(props){
      super(props)
    }

    componentDidMount() {
      const { user, getUserLocations } = this.props
      getUserLocations(user.profile.username)
    }

    render() {
      const {user, location} = this.props
      return (
        <div className="profile-page">
            <Header location={location.pathname}>
                <ProfileWidget/>
            </Header>
            <Tabs>
                <Tabs.Panel title={"Profil"}>
                    <ProfileArea/>
                </Tabs.Panel>
                <Tabs.Panel title={"Réseaux de sentiers"}>
                    <LocationsArea sitePath={location.pathname}/>
                </Tabs.Panel>
                <Tabs.Panel title={"Sentiers"}>
                    {user && user.isLoading
                        ? <Spinner/>
                        : <TrailsArea sitePath={location.pathname}/>
                    }
                </Tabs.Panel>
                <Tabs.Panel title={"Tronçons"}>
                    <TrailSectionsArea sitePath={location.pathname}/>
                </Tabs.Panel>
            </Tabs>
        </div>
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelContainer)
