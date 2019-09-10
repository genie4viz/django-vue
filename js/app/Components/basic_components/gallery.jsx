import React, {Component, PropTypes} from "react"
import Gallery from "react-photo-gallery"

import {getImageOfType} from "../../Utils/misc.js"

const prepareImagesArray = images => {
    let tempArray = [];
    for (var i = 0; i < images.length; i++) {
        let thumbnail = images[i],
            realImg = images[i],
            width = thumbnail.dimensions[0],
            height = thumbnail.dimensions[1];

        tempArray.push({
            src: thumbnail.image,
            width: width,
            height: height,
            aspectRatio: width / height,
            lightboxImage: {
                src: realImg.image,
                caption: `Crédit photo : ${images[i]['credit']} `
            }
        })
    }
    return tempArray;
}

export const ImageGallery = props => {
    const images = prepareImagesArray(getImageOfType(props.images));
    return images.length !== 0
    && (
        <section id="galery" data-pagenav-name="Galerie d'images"  className="gallery">
            <h2 className="info-page__headers">Galerie d'images</h2>
            <Gallery photos={images}/>
        </section>
    )
}

ImageGallery.propTypes = {
    images: PropTypes.array
}

ImageGallery.defaultProps = {
    images: []
}
