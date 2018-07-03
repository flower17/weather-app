import React from 'react';
import PropTypes from 'prop-types';

import { weatherIcons } from './weather-icons';
import DateString from './DateString';
import Wind from './Wind';

import './forecast-day.scss';

const ForecastDay = props => {
    return (
        <div className="forecast-day">
            <DateString seconds={props.forecast.date}
                        keepComma={false} />

            <div className="icon">
                <img src={weatherIcons[`icon${props.forecast.icon}`]} 
                     alt={props.forecast.description} />
            </div>
            <div className="temp">
                <div className="temp-max">
                    {props.forecast.tempMax}
                    {props.settings.units === `metric`
                            ? `°C`
                            : `°F`}
                </div>
                <div className="temp-min">
                    {props.forecast.tempMin}
                    {props.settings.units === `metric`
                            ? `°C`
                            : `°F`}
                    </div>
            </div>
            <Wind windDir={props.forecast.windDir}
                  windSpeed={props.forecast.windSpeed} 
                  units='metric' />   {/* // TODO: take units from settings*/}
        </div>
    );
}

ForecastDay.propTypes = {
    forecast: PropTypes.shape({
        date: PropTypes.number.isRequired,
        icon: PropTypes.string.isRequired,
        tempMax: PropTypes.number.isRequired,
        tempMin: PropTypes.number.isRequired,
        windDir: PropTypes.number,
        windSpeed: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
};

export default ForecastDay;