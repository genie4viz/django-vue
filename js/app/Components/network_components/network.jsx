import React, { Component, PropTypes } from "react"
import { Link } from "react-router"
import ReactDOM from "react-dom"
import StarRatingComponent from "react-star-rating-component"
import classNames from "classnames"

import { MapHikster } from "../../Map/mapClass.jsx"
import { Tooltip } from "../tooltip.jsx"
import Expander from "../basic_components/expander.jsx"

import { getTrailDifficulty, getPathType, getSportsType, getDistance, getDuration, checkIfUndefined } from "../utils/utils.js"
import { getRandomInt } from "../../Utils/numbers.js"
import { getSubStr } from "../../Utils/strings.js"
import { getImageOfType } from "../../Utils/misc.js"

import { SITE_PATH } from "../../config.jsx"

const style = {
    backgroundColor: "#f0f0f0"
}

export const NetworkHero = ({ network }) => {

      let bannerImage;

      network.images.map( (currImg) => {
        if(currImg['image_type'] === 'banner' ) {
          bannerImage = currImg
        } else {
          return
        }
        return bannerImage
      })

    const backgroundImage = bannerImage ? { background: `url('${bannerImage.image}') right` } : { background: "url('/static/img/accueil-1.jpeg') right" }
    return (
        <section className = "hero" style = { backgroundImage }>
            <div className = "hero__info hero__info--center">
                <h1 className = "hero__title" > { network.name }</h1>
            </div>
        </section>
    )
};

NetworkHero.propTypes = {
    network: PropTypes.object.isRequired
}

export const NetworkStats = ({ network }) => {
    const {
        name,
        network_length
    } = network

    let contacts = {}

    network.contact.map(item => {
        switch (item.type) {
            case "Site Internet":
                contacts["website"] = <a href={item.value.replace("#", "")} target="_blank">Voir le site web</a>
                break;
            case "Courriel":
                contacts["email"] = <a href={`mailto: ${item.value}`}>Courriel</a>
                break;
            case "Téléphone":
                contacts["phone"] = <p>{`Tél. ${item.value}`}</p>
                break
            default:
                break
        }
    })
    let contact = network.contact[0].type === "Site Internet"
        ? <a href={network.contact[0].value.replace("#", "")} target="_blank">Site Officiel</a>
        : false

    return (
        <section id="info" data-pagenav-name="Information">
            <div className="hike-detail">
                <div className="hike-detail__header">
                    <h2 className="hike-detail__title">{ name }</h2>
                    { network.address ? <p>{network.address}</p> : null}
                    { contacts.phone ? contacts.phone : null}
                    { contacts.email ? <p>{contacts.email}</p> : null}
                    { contacts.website ? <p>{contacts.website}</p> : null }
                </div>
            </div>
        </section>
    )
}

NetworkStats.propTypes = {
    network: PropTypes.object.isRequired
}

export class NetworkAbout extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let hash = this.props.routeLocation.hash.replace('#', '')

    if(hash) {
      let node = ReactDOM.findDOMNode(this.refs[hash]);
      if(node) {
        node.scrollIntoView({block: "end", behavior: "smooth"});
      }
    }
  }

  render() {
    const { network: { description, dog_allowed, living_rules}, isExpanderHidden, toggleLivingRules } = this.props

    return (
        <section ref="toNetworkRule" id="intro" data-pagenav-name="À propos" style={ style }>
            <div className="info-page">
                <h2 className="info-page__headers">À propos</h2>
                { description ? description.split('\n').map((item, index) => <p key={ index }>{ item }<br/></p>) : <p>Aucune information est disponible maintenant.</p> }
                <Expander
                    title="Règles de vie"
                    >
                    { living_rules
                        ? living_rules.split("\n").map((item, index) => <p key = { index } > { item } <br/> </p>)
                        : false
                    }
                    <br/>
                    { dog_allowed
                        ? <p>Chiens autorisés</p>
                        : <p>Chiens interdits</p>
                    }
                </Expander>
            </div>
        </section>
    )
  }
}

NetworkAbout.propTypes = {
    network: PropTypes.object.isRequired
}

export const NetworkDetails = ({ network, onTrailClick, trails }) => {
    const {
        schedule,
        fare_note,
        transport,
        exploitation_periods
    } = network

    let temp = checkIfUndefined()(exploitation_periods);

    const nonRepeatSports = trails.reduce( (acc, curr) => ({
        ...acc,
        [curr.activity]: (acc[curr.activity] || 0) + curr.total_length
    }), {})

    return (
        <section id="details" data-pagenav-name="Détails">
            <div className="info-page">
                <div className="ui vertical segment">
                    <h2 className="info-page__headers">Période d'accès / Horaire</h2>
                    {
                        schedule
                        ? schedule.split("\r\n").map((item, index) => <p key={index} className="info-page__description">{item}</p>)
                        : <p>Période d'accès ou horaire non-disponible</p>
                    }
                </div>
                <div className="ui vertical segment">
                    <h2 className="info-page__headers">Tarifs</h2>
                    {
                        fare_note
                        ? fare_note.split("\r\n").map((item, index) => <p key={index} className = "info-page__description">{item}</p>)
                        : <p className="info-page__description">Tarifs non-disponible</p>
                    }
                </div>
                <div className="ui vertical segment">
                    <h2 className="info-page__headers">Accès</h2>
                    {
                        transport
                        ? transport.split("\r\n").map((item, index) => <p key={ index } className="info-page__description" >{item}</p>)
                        : <p>Accès non-disponible</p>
                    }
                </div>
                <div className="ui vertical segment">
                    <h2 className="info-page__headers">Sports disponibles</h2>
                    <table className="ui olive structured very basic table">
                      <thead>
                          <tr>
                            <th>Sport</th>
                            {/* TODO: make the calculation correct once we have a way to filter trailsections
                              <th>Distance totale</th>
                            */}
                          </tr>
                      </thead>
                      <tbody>
                        {Object.keys(nonRepeatSports).map( (key, idx) => {
                          return (
                            <tr key={idx}>
                                <td>{getSportsType(parseInt(key))}</td>
                                {/* TODO: make the calculation correct once we have a way to filter trailsections
                                  <td>{getDistance(nonRepeatSports[parseInt(key)])}</td>
                                */}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                </div>
                <div className="ui vertical segment">
                    <h2 className="info-page__headers">Liste des sentiers</h2>
                    <NetworkTrails trails={trails}/>
                </div>
            </div>
        </section>
    )
}

NetworkDetails.propTypes = {
    network: PropTypes.object.isRequired,
    trails: PropTypes.array.isRequired
}

const NetworkTrail = ({ trail, onTrailClick }) => {
    const { activity, difficulty, path_type, total_length } = trail
    return (
        <tr>
            <td><Link to={`/hikes/${trail.id}/`}>{trail.name}</Link></td>
            <td>{checkIfUndefined(getDistance)(total_length)}</td>
            <td>{checkIfUndefined(getPathType)(path_type)}</td>
            <td>{checkIfUndefined(getSportsType)(activity)}</td>
        </tr>
    )
}

NetworkTrail.propTypes = {
    trail: PropTypes.object.isRequired,
    onTrailClick: PropTypes.func
}

export const NetworkTrails = ({ trails, onTrailClick }) => {
    return (
        <table className = "ui very basic celled table" >
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Distance</th>
                    <th>Type de sentier</th>
                    <th>Sports disponibles</th>
                </tr>
            </thead>
            <tbody>
                {
                    trails.map((item, index) => <NetworkTrail key={index} trail={item} onTrailClick={onTrailClick}/>)
                }
            </tbody>
        </table>
    )
}

NetworkTrails.propTypes = {
    trails: PropTypes.array.isRequired,
    onTrailClick: PropTypes.func
}

export const NetworkMap = ({ location }) => {
    return (
        <section id="map" data-pagenav-name="Carte">
            <div className="hike-map">
                <MapHikster location={location}/>
            </div>
        </section>
    )
};

NetworkMap.propTypes = {
    location: PropTypes.object
}
