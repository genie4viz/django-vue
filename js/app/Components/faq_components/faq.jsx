import React, {PropTypes} from "react";

export const FaqHeader = (props) => {
    return (
        <section className="hero">
            <div className="hero__info hero__info--center">
                <h1 className="hero__title">QUESTIONS FREQUENTES</h1>
            </div>
        </section>
    )
}

export const FaqContent = (props) => {
    return (
        <section className="misc-page__content">
            <ul>
                <li className="misc-page__item">
                    <h2>QUI EST HIKSTER ?</h2>
                    <p>Hikster est une entreprise spécialisée en géomatique basée à Longueuil / Montréal. </p>
                    <p>Hikster a développé une suite logicielle webmapping dont le but est de connecter les gestionnaires de parcs et les visiteurs afin de propulser les activités de plein air.</p>
                    <p>Les responsables de parc disposent d'outils avancés leur permettant - pour la première fois - de valoriser leur offre et de mieux comprendre le comportement des visiteurs. Ils peuvent créer de nouvelles expériences personnalisées, améliorer la gestion du parc et augmenter leurs revenus.</p>
                    <p>Les visiteurs disposent de cartes interactives, facile à utiliser, afin de profiter pleinement de l’offre du parc. Ces cartes sont accessibles via le web et via application mobile.</p>
                </li>
                <br/>
                <li className="misc-page__item">
                    <h2>COMMENT VALORISER NOTRE PARC ?</h2>
                    <p>Hikster propose différents abonnements en fonction de vos besoins. Pour en savoir plus, contactez-nous : <a href="mailto:info@hikster.com">info@hikster.com</a></p>
                    <br/>
                    <p>MEMBRE ESSENTIEL</p>
                    <p>En devenant membre Essentiel, vous disposez d’une interface de gestion pour votre parc. Vous êtes maître de votre information et toutes les mises à jour sont instantanément visibles par le public sur notre site Internet et application mobile.</p>
                    <br/>
                    <p>MEMBRE STANDARD</p>
                    <p>En plus des fonctionnalités Essentielles, vous disposez de votre propre carte interactive personnalisée, que vous intégrez sur votre site Internet : outil de communication fondamental pour faire découvrir la richesse de votre offre de plein air.</p>
                    <br/>
                    <p>MEMBRE PRO</p>
                    <p>Améliorez la compréhension de votre clientèle en recevant des statistiques concernant le comportement de vos visiteurs : données de localisation, durée de séjour, trajet. L’ajout de tags à vos lieux vous permet de mieux comprendre les intérêts de vos clients.</p>
                    <p>Toutes les données sont collectées à 100% de manière anonyme - aucune adresse e-mail, adresse MAC ou IDFA n'est stockée par notre système.</p>
                    <br/>
                    <p>MEMBRE PREMIUM</p>
                    <p>Vous souhaitez une offre sur-mesure ? Utiliser nos outils en marque blanche ? Notre équipe d’experts est à votre écoute.</p>
                </li>
                <br/>
                <li className="misc-page__item">
                    <h2>COMMENT VALORISER NOTRE HÉBERGEMENT OU RESTAURANT ?</h2>
                    <p>Pour mettre en valeur un point d’intérêt (Hébergement, restaurant, SPA, etc.), veuillez nous écrire à <a href="mailto:info@hikster.com">info@hikster.com</a>. Un responsable vous contactera pour obtenir toutes les informations nécessaires à la mise en valeur de votre point d’intérêt.</p>
                </li>
                <br/>
                <li className="misc-page__item">
                    <h2>J’AIME L'IDÉE ET JE VEUX AIDER, COMMENT FAIRE ?</h2>
                    <p>Développeur, cartographe, géomaticien, photographe, blogger, aventurier, tous les talents sont les bienvenus. Écrivez-nous à <a href="mailto:info@hikster.com">info@hikster.com</a>. On a hâte de vous découvrir !</p>
                </li>
            </ul>
        </section>
    )
}
