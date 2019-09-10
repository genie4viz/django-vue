import React, { Component, PropTypes } from 'react';

const Item = props => {
    return (
        <div className={`item ${props.classes}`}>
            <div className="content">
                <h2>{props.header}</h2>
                <div className="meta">
                    {props.meta}
                </div>
                <div className="description">
                    {props.description}
                </div>
                <div className="extra">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

Item.propTypes = {
    children: PropTypes.objectOf([
        PropTypes.array,
        PropTypes.element,
    ]).isRequired,
    classes: PropTypes.string,
    description: PropTypes.element,
    header: PropTypes.string,
    meta: PropTypes.element,
};

Item.defaultProps = {
    classes: ''
};

export default Item;