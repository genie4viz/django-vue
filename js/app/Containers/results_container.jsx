/**
 * Created by fbrousseau on 2016-03-30.
 */
import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import {Link} from "react-router"
import ui from "redux-ui"
import Tabs from "react-simpletabs"
import _ from "lodash"

import {Handle} from "../Components/basic_components/handle.jsx";
import {Header} from "../Components/basic_components/header.jsx"
import {Legend} from "../Components/legend.jsx";
import {MapHikster} from "../Map/mapClass.jsx";
import {Paginator} from "../Components/basic_components/paginator.jsx";
import {ResultList} from "../Components/results_components/results.jsx";
import {Spinner} from "../Components/basic_components/spinner.jsx";
import {Accordion, AccordionItem} from "../Components/basic_components/accordion.jsx"

import {fetchPage, PAGINATION} from "../Actions/pagination_actions.jsx"

import {SITE_PATH, md} from "../config.jsx"

const mapStateToProps = (state) => {
    return {searchResult: state.search}
}

const mapDispatchToProps = (dispatch) => {
    return {
        previousPage: (pageNum, link) => {
            dispatch(fetchPage(pageNum, link, PAGINATION));
        },
        nextPage: (pageNum, link) => {
            dispatch(fetchPage(pageNum, link, PAGINATION));
        }
    }
};
//Felix: future put this inside of the basic side panel component
const sidePanelUiState = {
    key: "side-panel",
    state: {
        isVisible: true
    }
}

export class ResultsContainer extends Component {
    static propTypes = {
        location: PropTypes.object,
        searchResult: PropTypes.object
    }

    constructor(props) {
        super(props)
    }

    //inline error elements handling; put {this.renderErrorMessage()} where we want to show users errors
    // renderErrorMessage() {
    //     const { searchResult } = this.props
    //
    //     if (searchResult.location.error || searchResult.poi.error || searchResult.trail.error == false) {
    //       return (
    //           <span>Sorry, something went wrong. Please try again later or contact our team. Redirect to <a href={SITE_PATH}>Homepage</a></span>
    //       )
    //     }
    // }

    render() {
        const {searchResult, location, ui, nextPage, previousPage} = this.props;

        let results = searchResult.trail.data.length !== 0 ? searchResult.trail.data.results : [];
        
        let shouldOpenResults = results.length > 0 ? 1 : null

        let paginatorTrails = searchResult.trail.data.number_of_pages > 1
            ? <Paginator
                nextPage={this.props.nextPage}
                previousPage={this.props.previousPage}
                style={{height: "150px"}}
                {...searchResult.trail.data}/>
            : false;

        let output = null;
        if (searchResult.searchSubmitted) {
            output = <ResultList results={results} previousPage={previousPage} nextPage={nextPage} searchObject={searchResult}/>;
        }
    
        return (
            <div className="results-page">
                <Header
                    location={location.pathname}>
                    <Link className="hide-on-small" to={"/faq/"}>Aide</Link>
                    <Link className="hide-on-small" to={"/toc/"}>Responsabilités</Link>
                    <Link className="hide-on-small" to={"/about/"}>Nous connaître</Link>
                </Header>

                {/* <div className="accordion-wrapper">
                    <Link to={'/'}><div className="homepage-link"><img src='../../img/Logo_Hikster_Beta-01--blanc.png' alt='Hikster Logo'/></div></Link>

                    <Accordion modifiedStyle='first-level' defaultOpenedItem={shouldOpenResults}>

                      <AccordionItem modifiedItemStyle='first-level' title="RECHERCHER">
                        <SearchForm location={location.pathname}/>
                      </AccordionItem>

        <AccordionItem modifiedItemStyle='first-level' title="R&Eacute;SULTATS" >*/}

                    <div className="accordion-wrapper">
                        {paginatorTrails}
                        {output}
                        {paginatorTrails}
                    </div>

                      {/*</AccordionItem>

                      <AccordionItem modifiedItemStyle='first-level' title="CONTR&Ocirc;LER LA CARTE">
                        <Legend></Legend>
                      </AccordionItem>

                    </Accordion>

                </div> */}

                <MapHikster location={location}/>
            </div>
        )
    }
}

ResultsContainer = ui(sidePanelUiState)(ResultsContainer)

export default connect(mapStateToProps, mapDispatchToProps)(ResultsContainer)
