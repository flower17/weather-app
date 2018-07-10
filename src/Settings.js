import React from 'react';
import PropTypes from 'prop-types';

import './settings.scss';

const Settings = props => {

    const handleChange = (e) => {
        console.log('e.target.id', e.target.id);
        props.updateSettings(e.target.id);
    }

    const handleBack = () => {
        //this.props.history.push(`/${cityData.id}`);
        props.history.goBack();
    }
    

    return (
        <div className="settings">
            <span onClick={handleBack}>&larr;</span>
            Select units:
            <input type="radio" id="metric" name="units" onChange={handleChange} 
                   defaultChecked={props.settings.units === "metric"}  />
            <label htmlFor="metric" > Metric </label>

            <input type="radio" id="imperial" name="units" onChange={handleChange} 
                   defaultChecked={props.settings.units === "imperial"} />
            <label htmlFor="imperial" > Imperial </label>
        </div>
    );

}

// CityLog.propTypes = {
//     cityList: PropTypes.array.isRequired,
//     loadWeatherForCity: PropTypes.func.isRequired,
// };

export default Settings;