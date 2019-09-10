/**
 * Created by fbrousseau on 2016-03-15.
 */

// Plugin imports
import React, {Component, PropTypes} from "react"
import {Link} from "react-router"
//import StarRatingComponent from "react-star-rating-component"

import {getTrailDifficulty, getPathType, getSportsType, getDistance, getDuration, checkIfUndefined} from "../utils/utils.js"

// Misc imports
import * as Actions from "../../Constants/constants.jsx"
import {Observable} from "../../Utils/misc.js"
import {SITE_PATH} from "../../config.jsx"

import {md} from "../../config.jsx"

const Result = ({index, result}) => {
    const {id, activity, location, name} = result

    let resultUrl = <Link to={`/hikes/${id}/`}>Sentier &#9656;</Link>,
        networkUrl = <Link to={`/locations/${location.location_id}/`}>Reseau &#9656;</Link>

    let isMobile = md.mobile()

    return (
        <li className="results-container__item">
            <div className="hovereffect" onMouseEnter={() => Observable.emit(Actions.HIGHLIGHT_HIKE, result)}>
                <img src={`/static/img/accueil-1--thumbnail.jpeg`} alt=""/>
                <div className="overlay">
                    <h2>{result.name}</h2>
                    <h3>{result.location.name}</h3>
                    <h2><span>{getTrailDifficulty(result.difficulty)}</span></h2>
                </div>

                <div className="trail-details">
                  <div className="trail-details--item">
                    <p>Longueur</p>
                    <strong>{(result.total_length/1000).toFixed(2)} km</strong>
                  </div>

                  <div className="trail-details--item">
                    <p>D&eacute;nivel&eacute; &#43;</p>
                    <strong>{result.height_positive} m</strong>
                  </div>

                  <div className="trail-details--item">
                    <p>D&eacute;nivel&eacute; &minus;</p>
                    <strong>{result.height_negative} m</strong>
                  </div>

                  <div className="trail-details--item">
                    <a
                        onClick={
                          () => {Observable.emit(Actions.ZOOM_TO_HIKE, result)
                                  if (isMobile) {
                                  Observable.emit('OPEN_RESULT_LIST', null)
                                  }
                                }
                          }
                        >Voir la carte &#9656;<strong className="icon-Boussole"></strong>
                    </a>
                  </div>
                </div>
              </div>

              <div className="user-actions">
                <div className="btn--result__results-component">{resultUrl}</div>
                <div className="btn--result__results-component">{networkUrl}</div>
              </div>
        </li>
    )
}

Result.propTypes = {
    index: PropTypes.number.isRequired,
    result: PropTypes.any.isRequired
}

export const ResultList = ({results}) => {
    let resultsHtml

    if (results.length === 0) {
        resultsHtml = <p>Aucun résultat ne correspond à votre recherche.</p>
    } else {
        resultsHtml = results.map((result, index) => <Result key={index} index={index} result={result}/>)
    }

    return (
        <div className="results-container">
            <ul onMouseLeave={() => Observable.emit(Actions.HIGHLIGHT_HIKE_OFF)}>
                {resultsHtml}
            </ul>
        </div>
    )
}

ResultList.propTypes = {
    results: PropTypes.any.isRequired
}
