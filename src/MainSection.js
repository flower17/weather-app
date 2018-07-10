import React from 'react';
import PropTypes from 'prop-types';

//import './city-log.scss';
//import { weatherIcons } from './weather-icons';

import DateString from './DateString';
import SearchBox from './SearchBox';
import GeoCoordinates from './GeoCoordinates';
import Suntime from './Suntime';
import CityLog from './CityLog';
import CurrentWeather from './CurrentWeather';

const MainSection = props => {
    
    return (
        <section className="main-section">
            <DateString seconds={props.weather.date}
                        keepComma={true} 
                        showSettings={true}/>

            <CityLog cityList={props.cityLog}
                    loadWeatherForCity={props.loadWeatherForCity} />

            <SearchBox city={props.city}
                    loadWeatherForCity={props.loadWeatherForCity}/>

            <GeoCoordinates lat={props.weather.lat}
                            lon={props.weather.lon}/>

            <Suntime sunrise={props.weather.sunrise}
                    sunset={props.weather.sunset}
                    gmtOffset={props.city.gmtOffset}/>

            <CurrentWeather weather={props.weather}
                            settings={props.settings}/> 
            
        </section>
    );

}

// CityLog.propTypes = {
//     cityList: PropTypes.array.isRequired,
//     loadWeatherForCity: PropTypes.func.isRequired,
// };

export default MainSection;