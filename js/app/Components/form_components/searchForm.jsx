/**
 * Created by fbrousseau on 2016-03-09.
 */
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {reduxForm, Field, formValueSelector} from "redux-form";
import axios from "axios";
import classNames from "classnames";
import Select from "react-select";
import {Autocomplete} from "../basic_components/autocomplete.jsx";
import { Button } from '../basic_components/buttons.jsx';
import {CheckboxWithLabel} from "../basic_components/checkbox.jsx";
import {Legend} from "../legend.jsx";
import * as Modal from '../basic_components/modal.jsx';
import {search, selectDynamicLayer} from "../../Actions/actions.jsx";
import {ReactSelectField} from "./fields/reactSelectField.jsx";
// import {FormState} from './states/formStates.js'


import {validate} from "./validator/searchFormValidator.js";
import {orderedRegions} from "./utils/fieldTranslationsMapping";


import {Observable} from '../../Utils/misc.js';

import {API_ROOT, SITE_PATH} from "../../config.jsx";

const mapDispatchToProps = dispatch => {
  return {
      search: formData => dispatch(search(formData))
  }
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.search.trail.isLoading
  }
}

export class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
        }

        this.handleModalToggle = this.handleModalToggle.bind(this);
        this.autoSearch = this.autoSearch.bind(this);
    }

    renderSearchButton() {
      const {handleSubmit, location, isLoading, search} = this.props;

      let buttonStyles = classNames(
        {"search-form__button": location.includes("results")},
        {"fluid": !location.includes("results")},
          "ui",
        {"loading": isLoading},
        "button"
      )

      return (
        <div>
          <button className={buttonStyles}
                  onClick={handleSubmit(formData => {return search(formData)})}>
            Recherche <span>&#9656;</span>
          </button>
        </div>
      )
    }

    handleModalToggle() {
        this.setState({modalActive: !this.state.modalActive})
    }

    autoSearch() {
        const {handleSubmit} = this.props;
        if (this.props.autoSearch) {
            handleSubmit(formData => {return search(formData)})
            console.log("click")
        }
    }

    render() {
        const {location, handleSubmit, search} = this.props;

        let difficultyOptions = [
            {
                value: 0,
                label: "Toutes les difficultés"
            }, {
                value: 1,
                label: "Débutant"
            }, {
                value: 2,
                label: "Modéré"
            }, {
                value: 3,
                label: "Intermédiaire"
            }, {
                value: 4,
                label: "Soutenu"
            }, {
                value: 5,
                label: "Exigeant"
            }
        ]

        let activityChoices = [
            {
                value: 1,
                label: "Randonnée pédestre"
            }, {
                value: 2,
                label: "Raquette"
            }, {
                value: 3,
                label: "Randonnée hivernale - À venir",
                disabled: true
            }, {
                value: 4,
                label: "Vélo de montagne - À venir",
                disabled: true
            }, {
                value: 5,
                label: "Fatbike - À venir",
                disabled: true
            }, {
                value: 6,
                label: "Vélo - À venir",
                disabled: true
            }, {
                value: 7,
                label: "Ski de fond - À venir",
                disabled: true
            }, {
                value: 8,
                label: "Équitation - À venir",
                disabled: true
            }
        ]

        let lengthChoices = [
            {
                value: 0,
                label: "Illimité"
            }, {
                value: "0-2",
                label: "0-2 km"
            }, {
                value: "2-5",
                label: "2-5 km"
            }, {
                value: "5-10",
                label: "5-10 km"
            }, {
                value: "10",
                label: "+10 km"
            }
        ]

        let typeChoices = [
            {
                value: 0,
                label: "Tous les types"
            }, {
                value: 1,
                label: "Aller simple"
            }, {
                value: 2,
                label: "Boucle"
            }, {
                value: 3,
                label: "Aller-retour"
            }
        ]

        // Set dynamic styles
        let formStyle = classNames(
            "main-search"
        )

        let modifiedFormStyle = classNames(
          {"search-form--results-page": location.includes("results")}
        )

        let modifiedSelectStyle = classNames(
          {"modifiedSelectStyle": location.includes("results")}
        )

        let modifiedCheckboxStyle = classNames (
            {"modifiedCheckboxStyle": location.includes("results")}
        )

        let modifiedFieldStyles = classNames(
          "field",
          {"modifiedFieldStyle": location.includes("results")},
        )

        let modifiedFieldBg = classNames({
          "modifiedFieldBg": location.includes("results"),
        })

        let hideOnHomepage = classNames({
          "hideOnHomepage": !location.includes("results")
        })

        let hideOnResults = classNames({
            "hideOnResults": location.includes("results")
        })

        let mobileBlock = classNames({
            "mobileBlock": location.includes("results")
        })

        let placeholderRegion = <span>R&Eacute;GION<span className={`dropdown-arrow ${hideOnHomepage}`}> &#9662;</span></span>;
        let placeholderLongueur = <span>LONGUEUR<span className={`dropdown-arrow ${hideOnHomepage}`}> &#9662;</span></span>;
        let placeholderDifficulty = <span>DIFFICULT&Eacute;<span className={`dropdown-arrow ${hideOnHomepage}`}> &#9662;</span></span>;
        let placeholderSport = <span>SPORT<span className={`dropdown-arrow ${hideOnHomepage}`}> &#9662;</span></span>;
        let placeholderType = <span>TYPE<span className={`dropdown-arrow ${hideOnHomepage}`}> &#9662;</span></span>;

        return (
            <div className={`ui form ${modifiedFormStyle}`}>
                <div className={modifiedFieldStyles}>
                    <Field
                        location={location}
                        name="search_term"
                        component={ Autocomplete }
                        //onChange={this.autoSearch}
                        />

                    <button
                        id="search-button"
                        className={hideOnHomepage}
                        onClick={this.autoSearch}>

                        <img className="icon--small" src="/static/img/icons/hikster/Icons_Hikster_2_colors-18.svg" />
                    </button>
                </div>

                <div className={`${formStyle}__hike-filters`}>

                    {/*
                      TODO small hack to explicitly pass the value portion of the options
                      object.
                    */}

                    <div className={`field--modified ${modifiedFieldBg} ${hideOnResults}`}>
                        <Field
                            name="search_term"
                            component={ReactSelectField}
                            placeholder={placeholderRegion}
                            options={orderedRegions}
                            className={modifiedSelectStyle}
                        />
                    </div>

                    <div className={mobileBlock}>
                        <div className={`field--modified ${modifiedFieldBg}`}>
                            <Field
                                name="activity"
                                className={modifiedSelectStyle}
                                component={ReactSelectField}
                                placeholder={placeholderSport}
                                options={activityChoices}
                                // onChange={this.autoSearch}
                            />   
                        </div>

                        <div className={`field--modified ${modifiedFieldBg} ${hideOnHomepage}`}>
                            <Field
                                name="difficulty"
                                component={ReactSelectField}
                                className={modifiedSelectStyle}
                                options={difficultyOptions}
                                placeholder={placeholderDifficulty}
                                //onChange={this.autoSearch}
                            />
                        </div>

                        <div className={`field--modified ${modifiedFieldBg} ${hideOnHomepage}`}>
                            <Field
                                name="type"
                                component={ReactSelectField}
                                className={modifiedSelectStyle}
                                options={typeChoices}
                                placeholder={placeholderType}
                                //onChange={this.autoSearch}
                            />
                        </div>

                        <div className={`field--modified ${modifiedFieldBg} ${hideOnHomepage}`}>
                            <Field
                                name="length"
                                component={ReactSelectField}
                                options={lengthChoices}
                                placeholder={placeholderLongueur}
                                className={modifiedSelectStyle}
                                //onChange={this.autoSearch}
                            />
                        </div>
                        {/*
                        TODO small hack to explicitly pass the value portion of the options
                        object.
                        */}
                    </div>

                    <div className={mobileBlock}>
                        <div className={modifiedCheckboxStyle}>
                            <Field name="dog_allowed" component={props => {
                                    return <CheckboxWithLabel location={location} value={props.input.value} onChange={props.input.onChange}/>
                                }}/>
                        </div>

                        <div className={`poi-modal-toggle ${hideOnHomepage}`}>
                            <button className="btn--result" onClick={this.handleModalToggle}>
                                Filtrer POI
                            </button>
                            <Modal.ModalComponent active={this.state.modalActive}>
                                <Modal.ModalContent title={<button className="btn--close-modal" onClick={this.handleModalToggle}>&times;</button>}>
                                    <Legend />
                                </Modal.ModalContent>
                            </Modal.ModalComponent>
                        </div>
                    </div>
                </div>
                <span className={hideOnResults}>{this.renderSearchButton()}</span>
            </div>
        );
    }

    // _handleSubmit (formData) {
    //   search();
    //   Observable.emit('OPEN_RESULT_LIST', 1)
    // }
}

SearchForm.propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    location: PropTypes.string,
    submitting: PropTypes.bool,
    isLoading: PropTypes.bool,
}

SearchForm = reduxForm({
    form: "search",
    initialValues: {
        activity: 1
    },
    validate
})(SearchForm)

export default SearchForm = connect(mapStateToProps, mapDispatchToProps)(SearchForm)
