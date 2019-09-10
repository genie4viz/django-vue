/**
 * Created by fbrousseau on 2016-03-09.
 */
import React, {PropTypes} from "react";
import {Link} from "react-router";
import classNames from "classnames";
import _ from "lodash";
import StarRatingComponent from "react-star-rating-component";

import {SITE_PATH} from "../config.jsx";

const ShowcaseItem = (props) => {
    let item_sizes = classNames({"grid-item": true}),
        src = props.item.images.length > 0 ? props.item.images.filter(function(value){return value.image_type === "photo";})[0].image : "/static/img/accueil-1--2x.jpeg";

    return (
        <div className={item_sizes}>
            <div className="hovereffect">
                <img src={src} alt=""/>
                <div>
                    <h2>{props.item.name}</h2>
                    <div className="result-content">
                        <Link to={`/location/${props.item.location.location_id}/`}><h3>{props.item.location.name}</h3></Link>
                        <Link
                            className="btn--result"
                            to={`/hikes/${props.item.trail_id}/`}
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onResultClick(props.item);
                        }}>Détails
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

ShowcaseItem.propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onResultClick: PropTypes.func.isRequired
};

const ShowcaseItemList = ({showcase, onResultClick}) => {
    var Masonry = require("react-masonry-component");

    var itemList = showcase.map((item, index) => {
        return <ShowcaseItem key={index} item={item} index={index} onResultClick={onResultClick}/>
    });

    return (
        <section className="our-selections">
            <Masonry className="showcase" options={{
                itemSelector: ".grid-item",
                columnWidth: ".grid-sizer",
                percentPosition: true
            }}>
                <div className="grid-sizer"></div>
                {itemList}
            </Masonry>
        </section>
    )
};

ShowcaseItemList.propTypes = {
    onResultClick: PropTypes.func,
    showcase: PropTypes.any.isRequired
};

export default ShowcaseItemList;
