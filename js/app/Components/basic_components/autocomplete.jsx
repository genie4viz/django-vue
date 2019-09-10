import React, {Component, PropTypes} from "react"
import Autosuggest from "react-autosuggest"
import axios from "axios"
import {random as _Random} from "lodash/fp"
import classNames from "classnames"

import {getRandomInt} from "../../Utils/numbers.js"

import {API_ROOT, SITE_PATH} from "../../config.jsx"

const placeholders = [
    "Cherchez une région",
    "Cherchez une ville",
    "Cherchez un parc",
    "Cherchez \"Cantons-De-L'Est\"",
    "Cherchez \"Route des Zingues\"",
    "Cherchez \"Mont Saint-Bruno\"",
    "Cherchez \"Gaspésie\"",
    "Cherchez \"Petite-Vallée\"",
    "Cherchez \"Magog\"",
    "Cherchez \"Charlevoix\"",
    "Cherchez \"Grands-Jardins\""
]

const getSuggestionValue = (suggestion) => {
    return `${suggestion.name} (${suggestion.location_id})`
}

const renderSuggestion = (suggestion, {value, valueBeforeUpDown}) => {
    let src

    switch (suggestion.type) {
        case 8:
            src = "/static/img/icons/autocomplete/ville.png"
            break
        case 9:
            src = "/static/img/icons/autocomplete/sommet.png"
            break
        case 10:
            src = "/static/img/icons/autocomplete/region_touristique.png"
            break
        case 11:
            src = "/static/img/icons/autocomplete/sentier.png"
            break
        default:
            src = "/static/img/icons/autocomplete/sentier.png"
            break
    }

    return (
        <div>
            <img src={src} alt=""/>
            <span>{" " + suggestion.name}</span>
        </div>
    )
}

const shouldRenderSuggestions = (value) => {
    return value.trim().length >= 3
}

export class Autocomplete extends Component {
    static propTypes = {
        error: PropTypes.string,
        input: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.inputPlaceholder
        this.inputInterval
        this.state = {
            suggestions: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.inputPlaceholder = document.querySelector(".react-autosuggest__input")

        this.inputInterval = setInterval(() => {
            this._animatePlaceholder(element => {
                this.inputPlaceholder.classList.toggle("disappear")
            })
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this.inputInterval)
    }

    render() {
        //Autosuggest
        const {
            input: {
                value,
                onChange
            },
            meta: {
              error,
              touched
            },
            location
        } = this.props

        const {suggestions} = this.state

        const inputProps = {
            placeholder: "Où voulez-vous aller?",
            value: value,
            onChange: (event, {newValue}) => {
                onChange(newValue)
            }
        }

        let errorMessageStyles = classNames(
          'ui red mini message',
          {'result-page': location.includes("results")}
        )
        return (
            <div>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsUpdateRequested={this._onSuggestionsUpdateRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  shouldRenderSuggestions={shouldRenderSuggestions}
                  inputProps={inputProps}
                  />
                  {touched && error && <span className={errorMessageStyles}>{error}</span>}
            </div>
        )
    }

    _onSuggestionsUpdateRequested = ({value}) => {
        this._loadSuggestions(value)
    }

    _loadSuggestions = value => {
        const {input} = this.props
        setTimeout(() => {
            axios.get(`${API_ROOT}/locations/autosuggest/`, {
                params: {
                    "search_term": value,
                    "include": "location_id,name,object_type,type"
                },
                responseType: "json",
                timeout: 20000
            }).then(response => {
                const suggestions = response.data

                if (value !== input.value) {
                    this.setState({isLoading: false, suggestions})
                }
            }).catch(response => {})
        }, 500)
    }

    _animatePlaceholder = (callback) => {
        this.inputPlaceholder.classList.toggle("disappear")
        setTimeout(() => {
            this.inputPlaceholder.placeholder = placeholders[_Random(0, placeholders.length-1)]
            callback(this.inputPlaceholder)
        }, 1000)
    }
}
