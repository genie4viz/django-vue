import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import ReactDOM from 'react-dom'
import {Link} from "react-router"
import axios from "axios"
import {isEmpty} from "lodash/fp"

import {NetworkHero, NetworkStats, NetworkAbout, NetworkDetails, NetworkGallery, NetworkMap} from "../Components/network_components/network.jsx"
import {Header} from "../Components/basic_components/header.jsx"
import {Footer} from "../Components/basic_components/footer.jsx"
import {Toolbox} from "../Components/basic_components/toolbox.jsx"
import {Spinner} from "../Components/basic_components/spinner.jsx"
import {ImageGallery} from "../Components/basic_components/gallery.jsx"
import PageNav from "../Components/basic_components/pageNav.jsx"
import {loadNetworkDetails} from "../Actions/network_details_actions.jsx"
import {selectHikeFromList} from "../Actions/actions.jsx"

const mapStateToProps = state => {
    return {network: state.network}
}

const mapDispatchToProps = dispatch => {
    return {
        fetchHikeNetwork: id => dispatch(loadNetworkDetails(id))
    }
}

class NetworkContainer extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // TODO fetch location based on location parameters
        const {fetchHikeNetwork, params} = this.props
        fetchHikeNetwork(params.locationId)
    }

    renderHikeNetworkPage() {
        const {network: {details, trails}, location, onLogoutClick} = this.props
        return (
            <div className="hike-page">
              <Header
                location={location.pathname}>
                    <Link to={"/faq/"}>Aide</Link>
                    <Link to={"/toc/"}>Responsabilités</Link>
                    <Link to={"/about/"}>Nous connaître</Link>
                </Header>
                <NetworkHero network={details}/>
                <PageNav />
                <NetworkStats network={details}/>
                <NetworkAbout network={details} routeLocation={location}/>
                <NetworkDetails network={details} trails={trails}/>
                <NetworkMap location={location}/>
                <ImageGallery images={details.images}/>
                <Footer/>
            </div>
        )
    }

    renderLoadingSprite() {
        return <Spinner/>
    }

    render() {
        const {network} = this.props

        var element

        //Important to check if data is empty to render spinner BEFORE rendering actual page
        if (isEmpty(network.details) || network.isLoading) {
            element = this.renderLoadingSprite()
        } else if (network.error) {
            //console.log("There was a network error")
        } else {
            element = this.renderHikeNetworkPage()
        }

        return (element)
    }
}

NetworkContainer.propTypes = {
    fetchHikeNetwork: PropTypes.func.isRequired,
    network: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    selectTrail: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkContainer)
