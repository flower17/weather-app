import React from 'react';
import PropTypes from 'prop-types';
//import { Link } from 'react-router-dom';

//import './city-log.scss';
// import { weatherIcons } from './weather-icons';

// import DateString from './DateString';
// import SearchBox from './SearchBox';
// import GeoCoordinates from './GeoCoordinates';
// import Suntime from './Suntime';
// import CityLog from './CityLog';
// import CurrentWeather from './CurrentWeather';
import ForecastDay from './ForecastDay';

const ForecastSection = props => {
    if (!props.forecast){
        return null;
    }
    return (
        <section className="forecast-section">
            {
                props.forecast.map((item, i) => 
                    <ForecastDay key={i} 
                                    forecast={item}
                                    settings={props.settings} /> 
                )                                         
            }
        </section>
    );

}

// CityLog.propTypes = {
//     cityList: PropTypes.array.isRequired,
//     loadWeatherForCity: PropTypes.func.isRequired,
// };

export default ForecastSection;