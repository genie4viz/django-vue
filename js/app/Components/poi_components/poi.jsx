import React, {Component, PropTypes} from "react"
import {Link} from "react-router"
import StarRatingComponent from "react-star-rating-component"
import classNames from "classnames"
import DropZone from "react-dropzone"

import {MapHikster} from "../../Map/mapClass.jsx"
import {ImageGallery} from "../basic_components/gallery.jsx"

import {getSubStr} from "../../Utils/strings.js";

import {SITE_PATH} from "../../config.jsx"

const style = {
    backgroundColor: "#ddd"
}

const poiType = new Map([
    [2, "Abri chauffé"],
    [3, "Abri/relais/halte"],
    [7, "Auberge/gîte"],
    [58, "Auberge de jeunesse"],
    [11, "Camping"],
    [16, "Chalet/appartement"],
    [18, "Dépanneur/épicerie"],
    [64, "Hébergement insolite"],
    [71, "Hôtel"],
    [28, "Lean to"],
    [57, "Pourvoirie"],
    [42, "Refuge"],
    [44, "Restauration"]
]);

const formatContact = items => {
    let contacts = {}

    items.map(item => {
        switch (item.type) {
            case "Site Internet":
                contacts["website"] = <a href={item.value.replace("#", "")} target="_blank">Voir le site web</a>;
                break;
            case "Courriel":
                contacts["email"] = <a href={`mailto:${getSubStr(item.value, "#") || item.value}`}>Courriel</a>;
                break;
            case "Téléphone":
                contacts["phone"] = <p>{`Tél. ${item.value}`}</p>;
                break;
            default:
                break;
        }
    })

    return contacts
}

export const PoiHero = ({selectedPoi}) => {
    let difficulty,
        src = selectedPoi.images.length > 0 ? selectedPoi.images.filter(function(value){return value.image_type === "banner"})[0].image : "/static/img/accueil-1.jpeg"

    let backgroundImg = {
        background: `url("${src}") right`
    }

    return (
        <section className="hero" style={backgroundImg}>
            <div className="hero__info hero__info--center">
                <h1 className="hero__title">{selectedPoi.name}</h1>
            </div>
        </section>
    )
}

PoiHero.propTypes = {
    selectedPoi: PropTypes.object.isRequired
}

export const PoiStats = ({selectedPoi}) => {
    const {name, contact, address} = selectedPoi

    let contacts = formatContact(contact)

    return (
        <section>
            <div className="hike-detail">
                <div className="ui items">
                    <div className="item">
                        <div className="content">
                            <div className="hike-detail__header">
                                <h2 className="hike-detail__title">{name}</h2>
                                <p>{address.street_name}, {address.city} {address.province} {address.country} {address.postal_code}</p>
                                {contacts.phone}
                                {contacts.email}
                                <br/>
                                {contacts.website}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

PoiStats.propTypes = {
    selectedPoi: PropTypes.object.isRequired
}

export const PoiAbout = ({selectedPoi}) => {
    const { description, fare, type } = selectedPoi
    return (
        <section style={style}>
            <div className="info-page">
                <h2 className="info-page__headers">Type</h2>
                <p className="info-page__description">{poiType.get(type)}</p>
                <p className="info-page__description">À partir de <strong>{fare}</strong></p>
                <br />
                <h2 className="info-page__headers">Description</h2>
                <p className="info-page__description">{description || "Aucune description."}</p>
            </div>
        </section>
    )
}

PoiAbout.propTypes = {
    selectedPoi: PropTypes.object.isRequired
}

export const PoiMap = props => {
    return (
        <section>
            <div className="map">
                <MapHikster location={{pathname:"point-of-interests"}} {...props} />
            </div>
        </section>
    )
}

PoiMap.propTypes = {
    location: PropTypes.object
}

export const PoiInfo = ({selectedPoi}) => {
    const {images} = selectedPoi
    return (
        <section style={style}>
            <div className="hike-info">
                <ImageGallery images={images}/>
            </div>
        </section>
    )
}
