/**
 * Created by fbrousseau on 2016-03-14.
 */
import React, {PropTypes} from "react"
import {Link} from "react-router"
import moment from "moment"
import classNames from "classnames"

import {SearchForm} from "../Components/form_components/searchForm.jsx"
import CompassSprite from "../Components/basic_components/compass.jsx"

import {SITE_PATH} from "../config.jsx"
const getSeason = () => {
    switch (moment().month()) {
        case 9:
        case 10:
        case 11:
        case 0:
        case 1:
            return "winter"
        default:
            return "summer"
    }
}

export const Hero = (props) => {
    let theme = classNames({
        "hero": true,
        "hero--winter": "winter" === getSeason()
    })
    return (
        <section className={theme}>
            <div className="hero__content">

                <div className="hero__content--left">
                    <h1 className="hero__title">Trouvez<br/><small>votre terrain de jeu</small></h1>
                    <div className="hero__search-form">
                      <SearchForm location={props.location} autoSearch={false}/>
                    </div>
                </div>

                <div className="hero__content--middle">
                    <h1>ou</h1>
                </div>

                <div className="hero__content--right">
                    <Link to={"/results/"}><h1><small>Voir la carte</small><br/>interactive</h1>
                        <CompassSprite/>
                    </Link>
                </div>

            </div>

            <div className="hero__app-logos">
                <p>Disponsible aussi sur</p>
                <div className="badges">
                    <a href="https://itunes.apple.com/ca/app/hikster/id1189352320?mt=8">
                        <img
                            className="badges__logo"
                            src={"/static/img/badges/Download_on_the_App_Store_Badge_FR_135x40.svg"} alt=""/>
                    </a>
                    <a href='https://play.google.com/store/apps/details?id=com.appcom.hikster&hl=en&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                        <img
                            className="badges__logo badges__logo--google"
                            alt='Disponible sur Google Play'
                            src={'/static/img/badges/google-play-badge.png'}/>
                    </a>
                </div>
            </div>
        </section>
    )
}

Hero.propTypes = {
    location: PropTypes.string.isRequired
}

export const GPSTraceAnnouncement = ({onNewsletterSubmit}) => {
    return (
        <section className="gps-announcement">
            <div className="gps-announcement-details">
                <h2><small>Nous recensons actuellement plus de</small> 850 lieux de randonnées.</h2>

                <p>Inscrivez votre adresse mail pour être informé de nos évolutions.</p>
                <div className="gps-announcement-details__newsletter">
                    <div id="mc_embed_signup">
                        <form action="//hikster.us13.list-manage.com/subscribe/post?u=aa5189a99d4b28c67224bc23b&amp;id=dc569ab5d5" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                            <div id="mc_embed_signup_scroll">
                                <input style={{marginBottom: "0.5em"}} type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="Adresse courriel" required/>
                                <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
                                  <input type="text" name="b_aa5189a99d4b28c67224bc23b_dc569ab5d5" tabIndex="-1" value=""/>
                                </div>
                                <div className="clear">
                                  <input type="submit" value="Go" name="subscribe" id="mc-embedded-subscribe" className="button"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

GPSTraceAnnouncement.propTypes = {
    onNewsletterSubmit: PropTypes.func.isRequired
}

export const HomeLandscape = props => {
    return (
        <section style={
                {
                    background: `url('../img/${props.image}') right`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    minHeight: "35em",
                    height: "35em",
                }
            }/>
    )
}

export const Mission = () => {
    return (
        <section className="showcase-header">
            <div>
                <h2><small>Notre&nbsp;</small>raison d&rsquo;être</h2>
                <p>Au contact de la nature, il n’y a que des souvenirs heureux.</p>
                <p>C’est pour vous permettre de vivre des moments forts que nous avons créé Hikster. Nous vous aidons à concrétiser vos envies d’évasion.</p>
                <p>En vous emmenant jouer dehors, nous prenons le risque de vous laisser tomber en amour avec la nature, sa vie, sa force, sa fragilité et de vous donner le goût de la préserver.</p>
                <p>Nous sommes aussi tombés sous son charme, c’est pourquoi Hikster s’engage à reverser 1% de ses revenus pour la préservation de l’environnement.</p>
                <p>Alors sortez, il y a de la vie dehors !</p>
            <p>Pour nous soutenir, contactez <a href="mailto:info@hikster.com">info@hikster.com</a></p>
            </div>
            <div className="showcase-header__partners">
                <div className="showcase-header__partner">
                  <h3>Osprey<small>&nbsp;nous soutient</small></h3>
                  <a className="ui centered tiny image" href="http://www.ospreypacks.com/ca/fr/" target="_blank">
                      <img src={`/static/img/logo_osprey_w_bckgrnd.png`} alt="Logo Osprey Backpack"/>
                  </a>
                </div>
                <div className="showcase-header__partner">
                  <h3><small>Membre de&nbsp;</small>1% pour la planète</h3>
                  <a className="ui centered small image" href="http://onepercentfortheplanet.org/" target="_blank">
                      <img src={`/static/img/member_one_percent.png`} alt="One Percent Member"/>
                  </a>
                </div>
                <div className="showcase-header__partner">
                    <h3><small>Nous sommes partenaire de </small>Rando Québec</h3>
                    <a className="ui centered small image" href="https://randoquebec.ca/fr" target="_blank">
                        <img className="randoquebec_logo" src={`/static/img/logo-randoquebec--150.jpeg`} alt="Rando Québec"/>
                    </a>
                </div>
            </div>

        </section>
    )
}

export const Device = () => {
    return (
        <section className="device-background">
            <div className="device-background-content">
                <div className="device-text">
                    <h4>Obtenir l&rsquoapplication</h4>
                    <p>L&rsquoapplication Hikster est votre meilleur compagnon lors de vos aventures. Cherchez et consultez votre parcours. Partout. En tout temps.</p>
                    <div className="badges">
                        <img className="badges__logo" src={"/static/img/badges/Download_on_the_App_Store_Badge_FR_135x40.svg"} alt=""/>
                        <img className="badges__logo badges__logo--google" src={"https://play.google.com/intl/fr_ca/badges/images/generic/fr-play-badge.png"} alt=""/>
                    </div>
                </div>
                <div className="device">
                    <img src={"/static/img/iPhone-6s-Space-Gray-vertical.png"} alt="Hikster App Mobile iPhone-6s"/>
                </div>
            </div>
        </section>
    )
}
