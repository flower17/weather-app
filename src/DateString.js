import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { weatherIcons } from './weather-icons';
import { getDateString } from './helpers';

import './date-string.scss';

const DateString = props => {
    return (
        <div className="date-line">
            <div className="date-string">
                {getDateString(props.seconds, undefined, props.keepComma)}
            </div>
            {
                props.showSettings
                    ? 
                        <div className="settings-icon">
                            <Link to="/settings" ><img src={weatherIcons['settings']} alt="Settings"/></Link>
                        </div>
                    :   null
            }
        </div>
    );
}

DateString.propTypes = {
    date: 			PropTypes.number,
    keepComma:      PropTypes.bool,
};

export default DateString;