import React, { Component, PropTypes } from "react"
import { connect } from "react-redux"
import {Link} from "react-router"

import { fetchShowcase, searchHikes } from "../Actions/actions.jsx"
import {selectHikeFromList, registerToNewsletter} from "../Actions/actions.jsx"

import { Header } from "../Components/basic_components/header.jsx"
import { Hero, Device, Mission, GPSTraceAnnouncement, HomeLandscape } from "../Components/home.jsx"
import { Footer } from "../Components/basic_components/footer.jsx"
import ShowcaseItemList from "../Components/showcase.jsx"

const mapStateToProps = (state) => {
    return {
        authed: state.authed,
        showcase: state.showcase
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchShowcaseOnLoad: () => {
            dispatch(fetchShowcase())
        },
        onResultClick: (hike) => {
            dispatch(selectHikeFromList(hike))
        },
        onNewsletterSubscribe: (formData) => {
            dispatch(registerToNewsletter(formData))
        }
    }
}

class HomeContainer extends Component {
    static propTypes = {
        authed: PropTypes.object.isRequired,
        onResultClick: PropTypes.func.isRequired,

        location: PropTypes.object,
        showcase: PropTypes.any,
        fetchShowcaseOnLoad: PropTypes.func,
        onLogoutClick: PropTypes.func
    }

    constructor(props) {
        super(props)
    }

    // componentWillMount() {
    //     this.props.fetchShowcaseOnLoad()
    // }

    render() {
        const { authed, location, showcase, onResultClick, onLogoutClick, onNewsletterSubscribe } = this.props
        return (
            <div>
                <Header
                    authed={ authed }
                    location={ location.pathname }
                    onLogoutClick={ onLogoutClick }
                    >
                        <Link to={"/faq/"}>Aide</Link>
                        <Link to={"/toc/"}>Responsabilités</Link>
                        <Link to={"/about/"}>Nous connaître</Link>
                </Header>
                <Hero location={ location.pathname }/>
                <GPSTraceAnnouncement onNewsletterSubmit={onNewsletterSubscribe}/>
                <Mission/>
                <HomeLandscape image="paysage-accueil.jpg"/>
                {/*<ShowcaseItemList showcase={ showcase.data } onResultClick={onResultClick}/>
                <Device/>*/}
                <Footer/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
