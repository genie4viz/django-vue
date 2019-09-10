import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import axios from "axios"
import { isEmpty } from "lodash/fp"
import NotFound from '../Components/basic_components/NotFound.jsx'
import {
    HikeHero,
    HikeHeader,
    HikeStats,
    HikeSportTypes,
    HikeAbout,
    HikeRating,
    HikeMap,
    HikeFauna,
    HikeInfo
} from "../Components/hike_components/hike.jsx"
import { Header } from "../Components/basic_components/header.jsx"
import { Footer } from "../Components/basic_components/footer.jsx"
import { Spinner } from "../Components/basic_components/spinner.jsx"
import { Toolbox } from "../Components/basic_components/toolbox.jsx"
import { ImageGallery } from "../Components/basic_components/gallery.jsx"
import PageNav from "../Components/basic_components/pageNav.jsx"

import { MapHikster } from "../Map/mapClass.jsx"

import { loadTrailDetails } from "../Actions/hike_details_actions.jsx"

const mapStateToProps = (state) => {
    return {hikeDetails: state.hikeDetails}
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchHikeDetails: id => dispatch(loadTrailDetails(id))
    }
}

class HikeContainer extends Component {

    componentDidMount() {
        const { fetchHikeDetails, params } = this.props
        fetchHikeDetails(params.hikeId)
    }

    renderLoadingSprite() {
        return <Spinner />
    }

    renderHikePage() {
        const { hikeDetails, location, onLogoutClick } = this.props
        return (
            <div className = "hike-page">
                <Header
                  location={location.pathname}>
                      <Link to={"/faq/"}>Aide</Link>
                      <Link to={"/toc/"}>Responsabilités</Link>
                      <Link to={"/about/"}>Nous connaître</Link>
                </Header>
                <HikeHero hikeDetails={hikeDetails.data}/>
                <PageNav />
                <HikeHeader hikeDetails={hikeDetails.data}/>
                <HikeStats hikeDetails={hikeDetails.data}/>
                <HikeSportTypes hikeDetails={hikeDetails.data}/>
                <HikeAbout hikeDetails={hikeDetails.data}/>
                <HikeMap location={location}/>
                <ImageGallery images={hikeDetails.data.images}/>
                <Footer/>
            </div>
        )
    }

    render() {
        const { hikeDetails } = this.props
        if (isEmpty(hikeDetails.data) || hikeDetails.isLoading) {
            return this.renderLoadingSprite()
        } else if (hikeDetails.error) {
            //console.log("There was an error")
        } else {
            return this.renderHikePage()
        }
    }
}

HikeContainer.propTypes = {
    fetchHikeDetails: PropTypes.func.isRequired,
    hikeDetails: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(HikeContainer)
