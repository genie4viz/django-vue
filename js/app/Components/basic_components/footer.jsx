/**
 * Created by fbrousseau on 2016-03-14.
 */
import React from "react";
import {Link} from "react-router";
import { SITE_PATH } from "../../config.jsx";

export const Footer = (props) => {
    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-logo">
                <img src={"/static/img/Logo_Hikster_Beta-01--blanc-256.png"} alt="Logo image"/>
            </div>
            <div className="footer-links">
                <ul>
                    <li>
                        <h3>La société</h3>
                    </li>
                    <li>
                        <Link to={ "/about/" }>Nous connaître</Link>
                    </li>
                    <li>
                        <Link to={ "/faq/" }>Aide</Link>
                    </li>
                    <li>
                        <Link to={ "/toc/" } >Responsabilités</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <h3>Liens utiles</h3>
                    </li>
                    <li>
                        <a href="http://www.sepaq.com/">Sépaq</a>
                    </li>
                    <li>
                        <a href="http://www.randoquebec.ca/">Rando Québec</a>
                    </li>
                    <li>
                        <a href="http://www.ospreypacks.com/ca/fr/">Osprey</a>
                    </li>
                    <li>
                        <a href="http://www.espaces.ca/">Espaces</a>
                    </li>
                </ul>
            </div>

            <hr/>

            <h3 className="footer__social-header">Rejoignez-nous sur</h3>
            <ul className="social-icons">
                <li>
                    <a href="https://www.facebook.com/Hikster-1071485126197771/?fref=ts"><div className="thumbnail thumbnail--facebook"></div></a>
                </li>
                <li>
                    <a href="https://www.instagram.com/hikster__/"><div className="thumbnail thumbnail--instagram"></div></a>
                </li>
                <li>
                    <a href="https://twitter.com/Hikster_inc"><div className="thumbnail thumbnail--twitter"></div></a>
                </li>
                <li>
                    <a href="https://fr.pinterest.com/hikster/"><div className="thumbnail thumbnail--pinterest"></div></a>
                </li>
            </ul>
            <p>&#169;2016 Hikster, Tous droits réservés <br/> &#45; <br/> Malgré tout le soin apporté à la présentation de nos cartes, Hikster ne peut garantir l'exactitude des informations qui y sont présentées. L'utilisateur dégage Hikster de toute responsabilité quant à l'utilisation de ces informations.</p>
        </footer>
    )
};
