import React, {PropTypes} from "react";

import {SITE_PATH} from "../../config.jsx";

export const AboutHero = (props) => {
    return (
        <section className="hero">
            <div className="hero__info hero__info--center">
                <h1 className="hero__title">NOUS CONNAÎTRE</h1>
            </div>
        </section>
    )
}

export const AboutContent = (props) => {
    return (
        <section>
            <div className="misc-page__content">
                <div className="ui items">
                    <div className="item">
                        <a className="ui small image">
                            <img src={"/static/img/Logo_256px_Green.png"} alt=""/>
                        </a>
                        <div className="content">
                            <a className="header">GÉREZ ET VALORISEZ VOS SENTIERS ET ACTIVITÉS TOURISTIQUES</a>
                            <div className="description">
                                <p>Hikster est une suite logicielle webmapping dont le but est de connecter les gestionnaires de parcs et les visiteurs afin de propulser les activités de plein air.</p>
                                <p>Les responsables de parc disposent d'outils avancés leur permettant - pour la première fois - de valoriser leur offre et de mieux comprendre le comportement des visiteurs. Ils peuvent créer de nouvelles expériences personnalisées, améliorer la gestion du parc et augmenter leurs revenus.</p>
                                <p>Les visiteurs disposent de cartes interactives, facile à utiliser, afin de profiter pleinement de l’offre du parc. Ces cartes sont accessibles via le web et via application mobile.</p>
                                <br/>
                                <p>MEMBRE ESSENTIEL</p>
                                <p>En devenant membre Essentiel, vous disposez d’une interface de gestion pour votre parc. Vous êtes maître de votre information et toutes les mises à jour sont instantanément visibles par le public sur notre site Internet et application mobile.</p>
                                <p>Pour en savoir plus, contactez-nous : <a href="mailto:info@hikster.com">info@hikster.com</a></p>
                                <br/>
                                <p>MEMBRE STANDARD</p>
                                <p>En plus des fonctionnalités Essentielles, vous disposez de votre propre carte interactive personnalisée, que vous intégrez sur votre site Internet : outil de communication fondamental pour faire découvrir la richesse de votre offre de plein air.</p>
                                <p>Pour en savoir plus, contactez-nous : <a href="mailto:info@hikster.com">info@hikster.com</a></p>
                                <br/>
                                <p>MEMBRE PRO</p>
                                <p>Améliorez la compréhension de votre clientèle en recevant des statistiques concernant le comportement de vos visiteurs : données de localisation, durée de séjour, trajet. L’ajout de tags à vos lieux vous permet de mieux comprendre les intérêts de vos clients.</p>
                                <p>Toutes les données sont collectées à 100% de manière anonyme - aucune adresse e-mail, adresse MAC ou IDFA n'est stockée par notre système.</p>
                                <p>Pour en savoir plus, contactez-nous : <a href="mailto:info@hikster.com">info@hikster.com</a></p>
                                <br/>
                                <p>MEMBRE PREMIUM</p>
                                <p>Vous souhaitez une offre sur-mesure ? Utiliser nos outils en marque blanche ? Notre équipe d’experts est à votre écoute.</p>
                            </div>
                        </div>
                    </div>
                    <br/>

                    <div className="item">
                        <a className="ui small image">
                            <img src={"/static/img/azimut-logo.png"} alt=""/>
                        </a>
                        <div className="content">
                            <a className="header">LE SAVOIR-FAIRE DU GROUPE DE GÉOMATIQUE AZIMUT</a>
                            <div className="description">
                                <p>La concrétisation du projet Hikster a été possible grâce à l'appui inconditionnel de l'équipe de <a href="http://www.goazimut.ca/initial.html?fr"> Groupe de géomatique AZIMUT</a>. Le site Web, la carte interactive et toutes les données sont le fruit du travail de ces professionnels de l’informatique et de la géomatique qui nous ont accompagnés tout au long de l'aventure. Nous leur en sommes reconnaissants et nous les en remercions!</p>
                            </div>
                        </div>
                    </div>
                    <br/>

                    <div className="item">
                      <a className="ui small image">
                        <img src={"/static/img/logo_osprey_w_bckgrnd.png"} alt=""/>
                      </a>
                      <div className="content">
                        <a className="header">SOUTENU PAR Osprey</a>
                        <div className="description">
                          <p><a href="http://www.ospreypacks.com/ca/fr/" target="_blank">Osprey</a> fait de la qualité de fabrication de ses sacs à dos une priorité. Nous avons l’honneur d’être reconnu et soutenu par cet acteur de référence dans le domaine du plein air. Nous aurons l’opportunité de faire gagner des sacs tout au cours de l’année.</p>
                          <p>“Fondée en 1974 et établie au Colorado, Osprey a pour mission de créer des équipements innovants et de hautes performances qui reflètent notre amour pour l’aventure et notre dévotion pour le plein air. Nous atteignons notre objectif lorsque nous répondons aux besoins de nos consommateurs les plus exigeants et qu’ils portent nos sacs avec fierté.”</p>
                        </div>
                      </div>
                    </div>
                    <br/>

                    <div className="item">
                      <a className="ui small image">
                        <img src={"/static/img/logo_espaces.png"} alt=""/>
                      </a>
                      <div className="content">
                        <a className="header">PROMU PAR ESPACES</a>
                        <div className="description">
                          <p><a href="http://www.espaces.ca/" target="_blank">Espaces</a> est le plus important média de plein air au Québec. Leur mission : proposer aux adeptes d'activités de plein air, d'aventure et de voyages, des médias et des événements qui contribuent activement à la réalisation de leurs intérêts.</p>
                          <p>Le magazine ESPACES est disponible sur plusieurs plateformes incluant les tablettes, le web et en version papier, et ce gratuitement depuis plus de 20 ans.</p>
                          <p>Nous sommes heureux qu’ils participent à la promotion de Hikster.</p>
                        </div>
                      </div>
                    </div>
                    <br/>

                    <div className="item">
                        <a className="ui small image">
                            <img src={"/static/img/fondation-montreal-inc-bourse-logo.jpg"} alt=""/>
                        </a>
                        <div className="content">
                            <a className="header">SOUTENU PAR LA FONDATION MONTRÉAL INC.</a>
                            <div className="description">
                                <p>Hikster est heureux lauréat de
                                    <a href="http://www.montrealinc.ca/fr"> La Fondation Montréal Inc.</a>, organisme à but non lucratif qui a pour mission de propulser vers le succès une nouvelle génération d’entrepreneurs montréalais prometteurs.</p>
                                <p>Grâce à la fondation, nous accédons à l'expertise de nombreux gens d’affaires chevronnés : Une opportunité inouie pour notre entreprise en démarrage! Nous remercions vivement la fondation pour le soutien apporté et pour croire en notre beau projet!</p>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        </section>
    )
}
