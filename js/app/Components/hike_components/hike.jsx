import React, { Component, PropTypes } from "react"
import { Link } from "react-router"
import StarRatingComponent from "react-star-rating-component"
import classNames from "classnames"
import DropZone from "react-dropzone"

import Expander from "../basic_components/expander.jsx"
import { MapHikster } from "../../Map/mapClass.jsx"

import { getTrailDifficulty, getPathType, getSportsType, getDistance, getDuration, checkIfUndefined } from "../utils/utils.js"

import { SITE_PATH } from "../../config.jsx"

export const HikeHero = props => {
    const { hikeDetails: {activity, difficulty, images, location, name} } = props

    let bannerImage;

    images.map( (currImg) => {
      if(currImg['image_type'] === 'banner' ) {
        bannerImage = currImg
      } else {
        return
      }
      return bannerImage
    })

    const backgroundImage = bannerImage ? { background: `url('${bannerImage.image}') right` } : { background: "url('/static/img/accueil-1.jpeg') right" }

    return (
        <section
            className="hero"
            style={backgroundImage}
            >
            <div className="hero__info hero__info--center">
                <h1 className="hero__title" > {name.toUpperCase()}</h1>
                <p className="hero__subtitle" >{ checkIfUndefined()(location.name)}</p>
            </div>
        </section>
    )
}

HikeHero.propTypes = {
    hikeDetails: PropTypes.object.isRequired
}

const safeSpaces = (e) => {
    var stringArray = e.split(' ');

    return (
        stringArray.join('%20')
    )
}

export const HikeHeader = ({ hikeDetails }) => {
    const {
        location,
        name,
    } = hikeDetails

    const location_link = location
        ? <Link to={`/locations/${location.location_id}/`}>Voir la fiche du parc</Link>
        : false
    const location_name = location
        ? location.name
        : <p>"-"</p>
    const location_website = location.contact.length !== 0 && location.contact[0].type === "Site Internet"
        ? <a href={location.contact[0].value.replace("#", "")} target="_blank">Site Officiel</a>
        : false

    return (
        <section className="hike-header" id="info" data-pagenav-name="Information">
            <div className="hike-header__header">
                <h2 className="hike-header__title">{name}</h2>
                { location_name } &nbsp;|&nbsp; { location_link }
                <br/>
                { location_website }
            </div>
            <ul className="hike-social-icons">
                <li className="hike-social-icons__title">
                    Share
                </li>
                <li>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location}`}>{/* <i className="icon facebook big"></i> */}Facebook &nbsp;&nbsp;</a>
                </li>
                <li>
                    <a href={`https://twitter.com/home?status=${window.location}`}>{/* <i className="icon twitter big"></i> */}Twitter &nbsp;&nbsp;</a>
                </li>
                <li>
                    <a href={`mailto:?subject=${safeSpaces(name)}%20-%20Hikster.com&body=${window.location}`}>{/* <i className="icon email big">@</i> */}Email &nbsp;&nbsp;</a>
                </li>
            </ul>
        </section>
    )
}

HikeHeader.propTypes = {
    location: PropTypes.object.isRequired
}

export const HikeStats = ({ hikeDetails }) => {
    const {
        activity,
        difficulty,
        duration,
        height_negative,
        height_positive,
        location,
        name,
        path_type,
        total_length,
    } = hikeDetails
    

    return (
        <section className="hike-stats" id="distance" data-pagenav-name="Distance">
            <div className="hike-detail--full-width bg-grey">
                <div className="hike-detail__stats">
                    <h2 className="hike-detail__stats-header">Distances et d&eacute;nivel&eacute;</h2>
                        <div className="hike-detail__stat">
                            <p>Type</p>
                            { checkIfUndefined(getPathType)(path_type) }
                        </div>
                        <div className="hike-detail__stat">
                            <p>Distance</p>
                            { checkIfUndefined(getDistance)(total_length) }
                        </div>
                        <div className="hike-detail__stat">
                            <p>Dénivelé +</p>
                            { checkIfUndefined()(height_positive) } m
                        </div>
                        <div className="hike-detail__stat">
                            <p>Dénivelé -</p>
                            { checkIfUndefined()(height_negative) } m
                        </div>
                        <div className="hike-detail__stat">
                            <p>Point le plus haut</p>
                            { checkIfUndefined()(undefined) }
                        </div>
                        <div className="hike-detail__stat">
                            <p>Point le plus bas</p>
                            { checkIfUndefined()(undefined) }
                        </div>
                </div>
                {/*
                <div className="hike-detail__sports" >
                    <p><strong>Sport: </strong>{ checkIfUndefined(getSportsType)(activity) }</p>
                </div>
                <div className="hike-detail__randoqc">
                    <p>Informations transmises par <a href="http://www.randoquebec.ca" target="_blank">Rando Québec</a>: </p>
                    <a href="http://www.randoquebec.ca"><img src={ "/static/img/rando_quebec_logo.png" } alt="Rando Quebec Logo"/></a>
                </div>
                */}
            </div>
        </section>
    )
}

HikeStats.propTypes = {
    hikeDetails: PropTypes.object.isRequired
}

export const HikeAbout = ({ hikeDetails, isExpanderHidden, toggleLivingRules }) => {
    const { description, location } = hikeDetails

    return (
        <section className="hike-about" id="intro" data-pagenav-name="À propos">
            <div className="info-page">
                <h2 className="info-page__headers">À propos</h2>
                { description ? description.split("\r\n").map((item, index) => <p key={ index }>{ item }</p>) : <p>Aucune information est disponible maintenant.</p> }


            <Link to={`/locations/${location.location_id}/#toNetworkRule`}><div className="info-page__link"><p>Voir la fiche du parc</p></div></Link>

            </div>
        </section>
    )
}

HikeAbout.propTypes = {
    hikeDetails: PropTypes.object.isRequired,
}

        //Possible feature to be implemented
export const HikeRating = (props) => <section className="hike-rating"></section>

export const HikeMap = ({ location }) => {
    return (
        <section id="map" data-pagenav-name="Carte">
            <div className="hike-map" >
                <MapHikster location={ location }/>
            </div>
        </section>
    )
}

HikeMap.propTypes = {
    location: PropTypes.object
}

export const HikeFauna = (props) => <section className="hike-fauna"></section>

export class HikeInfo extends Component {
    static propTypes = {
        hikeDetails: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        const { hikeDetails } = this.props
        return (
            <section >
                <div className = "hike-info" >
                    <h2 className = "hike-headers" > Contact </h2>
                    <div className = "hike-info__content" >{ /*TODO add address here*/ }</div>
                </div>
            </section>
        )
    }
}

//all sport types
const sportTypes = ['Randonnée pédestre', 'Raquette', 'Randonnée hivernale', 'Vélo de montagne', 'Fatbike', 'Vélo', 'Ski de fond', 'Équitation']

export class HikeSportTypes extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { hikeDetails: { activities, duration, difficulty, id} } = this.props

    let activityRows = null;
    if (activities.length) {
        activityRows = activities.map(activityId => {
            return (
                <tr key={activityId}>
                    <td>{sportTypes[activityId - 1]}</td>
                    <td>{ checkIfUndefined(getDuration)(duration) }</td>
                    <td>{ checkIfUndefined(getTrailDifficulty)(difficulty) }</td>
                    <td><a href={`https://hikster3d.hikster.com/order;hikstertrack=${id}`} target="_">Voir le sentier en 3D</a></td>
                </tr>
            );
        });
    }

    return (
      <section id="sports" data-pagenav-name="Sports">
          <div className='hike-sporttypes'>
              <h2 className="hike-sporttypes__header">Sports practicables</h2>
              <table className="ui olive structured very basic table">
                <thead>
                    <tr>
                      <th>Sport</th>
                      <th>Durée estimée</th>
                      <th>Difficulté</th>
                      <th>Voir le sentier en 3D</th>
                    </tr>
                </thead>
                <tbody>{activityRows}</tbody>
              </table>

          </div>
      </section>
    )
  }
}
