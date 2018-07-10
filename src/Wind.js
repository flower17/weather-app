import React from 'react';
import PropTypes from 'prop-types';

import { weatherIcons } from './weather-icons';

import './wind.scss';


const Wind = (props) => {
    
    let windStyle;
    if (props.windDir){
        windStyle = {
			transform: 'rotateZ(' + (props.windDir+180) + 'deg)'
		}
    }

    return (
        <div className="wind">
            {
                props.windDir
                    ? <img src={weatherIcons['wind']} alt="wind direction" style={windStyle} />
                    : null
            }
            
            <span>
                {props.windSpeed}
                {
                    props.settings.units === 'metric'
                        ? ' m/s '
                        : ' m/h '
                }
            </span>
        </div>
    );
}

Wind.propTypes = {
    windDir: PropTypes.number,
    windSpeed: PropTypes.number,
    settings: PropTypes.shape({
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }
    ).isRequired,
    
};

export default Wind;