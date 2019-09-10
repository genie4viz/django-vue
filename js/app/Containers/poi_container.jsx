import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import {reset} from "redux-form"
import {Link} from "react-router"
import ui from "redux-ui"
import axios from "axios"
import {isEmpty as _Empty} from "lodash"

import {
    PoiHero,
    PoiStats,
    PoiAbout,
    PoiRating,
    PoiMap,
    PoiFauna,
    PoiInfo
} from "../Components/poi_components/poi.jsx"

import ReservationForm from "../Components/form_components/mailForm.jsx"

import {Header} from "../Components/basic_components/header.jsx";
import {Footer} from "../Components/basic_components/footer.jsx"
import {Spinner} from "../Components/basic_components/spinner.jsx"
import {Toolbox} from "../Components/basic_components/toolbox.jsx"

import {MapHikster} from "../Map/mapClass.jsx"

import {getPoi} from "../Actions/poi_details_actions.jsx"

const mapStateToProps = (state) => {
    return {authed: state.authed, poiDetails: state.poiDetails}
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPoiDetails: (location) => {
            dispatch(getPoi(location))
        }
    }
}

@ui({
    key: "poi-details",
    state: {
        isExpanderHidden: true,
        isTooltipOpen: false
    }
})
@connect(mapStateToProps, mapDispatchToProps)
export class PoiContainer extends Component {
    static propTypes = {
        authed: PropTypes.object.isRequired,
        fetchPoiDetails: PropTypes.func.isRequired,
        poiDetails: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired,
        updateUI: PropTypes.func.isRequired,
        location: PropTypes.object,
        onLogoutClick: PropTypes.func
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { fetchPoiDetails, params } = this.props
        fetchPoiDetails(params.poiId)
    }

    toggleLivingRules() {
        if (this.props.ui.isExpanderHidden === true) {
            this.props.updateUI({isExpanderHidden: false})
        } else {
            this.props.updateUI({isExpanderHidden: true})
        }
    }

    renderLoadingSprite() {
        return (
            <div>
                <Spinner/>
            </div>
        )
    }

    renderPoiPage() {
        const {authed, poiDetails, location, onLogoutClick, ui, dispatch} = this.props
        const owner_email = poiDetails.data.contact.filter(item => item.type === "Courriel")

        return (
            <div className="hike-page">
                <Header
                    authed={authed}
                    location={location.pathname}
                    onLogoutClick={onLogoutClick}
                    >
                        <Link to={"/faq/"}>Aide</Link>
                        <Link to={"/toc/"}>Responsabilités</Link>
                        <Link to={"/about/"}>Nous connaître</Link>
                </Header>
                <PoiHero selectedPoi={poiDetails.data}/>
                <PoiStats selectedPoi={poiDetails.data}/>
                <PoiAbout selectedPoi={poiDetails.data}/>
                <PoiMap {...this.props}/>
                <PoiInfo selectedPoi={poiDetails.data}/>
                {/*
                <Toolbox title={"Cliquer pour pré-réserver"}>
                    <ReservationForm
                        initialValues={
                            {
                                email_to: owner_email[0].value,
                                people: {
                                    adults: 1,
                                    children: 0,
                                    babies: 0
                                },
                                message: ""
                            }
                        }
                        />
                </Toolbox>
                */}
                <Footer/>
            </div>
        )
    }

    render() {
        const { poiDetails } = this.props

        var element

        if(_Empty(poiDetails.data) || poiDetails.isLoading) {
            element = this.renderLoadingSprite()
        } else if (poiDetails.error) {
            //console.log("There was an error")
        } else {
            element = this.renderPoiPage()
        }

        return element
    }
}
