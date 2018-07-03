import React from 'react';
import PropTypes from 'prop-types';

import { convertCoords } from './helpers';

import './geo-coordinates.scss';

const GeoCoordinates = props => {
    if (!(props.lat && props.lon)){
        return null;
    }
    return (
        <div className="geo-coordinates">
            {convertCoords(props.lat, props.lon)}
        </div>
    );
}

GeoCoordinates.propTypes = {
    lan: PropTypes.number,
    lon: PropTypes.number,
};

export default GeoCoordinates;