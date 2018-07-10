import React from 'react';
import PropTypes from 'prop-types';

import { weatherIcons } from './weather-icons';
import Wind from './Wind';

import './current-weather.scss';

const CurrentWeather = props => {
    //console.log('CurrentWeather settings:', props.settings.units);
    return (
        <div className="current-weather">
            <div className="temp">
                    {props.weather.temp}
                    {
                        props.settings.units === `metric`
                            ? `°C`
                            : `°F`
                    }
            </div>
            <div className="icon">
                    <img src={weatherIcons[`icon${props.weather.icon}`]} 
                        alt={props.weather.description} />
            </div>
            <div className="humidity">
                <img src={weatherIcons[`humidity`]} 
                     alt="Humidity" />
                {props.weather.humidity} %
            </div>
            <Wind windSpeed={props.weather.windSpeed} 
                  windDir={props.weather.windDir}
                  settings={props.settings} />   
            <div className="description">
                    {props.weather.description}
            </div>
        </div>
    );
}

CurrentWeather.propTypes = {
    weather: PropTypes.shape({
        date: 			PropTypes.number,
        sunrise: 		PropTypes.number, 
        sunset: 		PropTypes.number, 
        lat: 			PropTypes.number, 
        lon: 			PropTypes.number, 
        icon: 			PropTypes.string, 
        description: 	PropTypes.string, 
        humidity: 		PropTypes.number, 
        windDir:  		PropTypes.number, 
        windSpeed: 		PropTypes.number,
        temp: 			PropTypes.number, 
    }).isRequired,
    settings: PropTypes.shape({
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
};

export default CurrentWeather;

