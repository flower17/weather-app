import React from 'react';
import PropTypes from 'prop-types';

import './city-log.scss';

const CityLog = props => {

    const handleClick = e => {
        const id = parseInt(e.target.dataset["id"], 10);

        const city = props.cityList.find(item => item.id === id);
        props.loadWeatherForCity(city);
    }


    return (
        <div className="city-log">
            <ul>
                {
                    props.cityList
                        ?   props.cityList.map((item, i) => 
                                <li key={`${item.id}_${i}`}
                                    data-id={item.id}
                                    onClick={handleClick}>
                                        {item.cityName}, {item.countryCode}                    
                                </li>)
                        : null
                }
            </ul>
        </div>
    );

}

CityLog.propTypes = {
    cityList: PropTypes.array.isRequired,
    loadWeatherForCity: PropTypes.func.isRequired,
};

export default CityLog;