import React from 'react';
import PropTypes from 'prop-types';

import { convertToDayTime } from './helpers';
import './suntime.scss';

const Suntime = props => {
    if (!(props.sunrise && props.sunset && props.gmtOffset)){
        return null;
    }
    return (
        <div className="suntime">
            <div>Sunrise: {convertToDayTime(props.sunrise, props.gmtOffset)}</div>
            <div>Sunset: {convertToDayTime(props.sunset, props.gmtOffset)}</div>
        </div>
    );
}

Suntime.propTypes = {
    sunrise: PropTypes.number,
    sunset: PropTypes.number,
    gmtOffset: PropTypes.number,
};

export default Suntime;