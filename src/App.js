import React from 'react';

import { ipstackURL, openweathermapCurrentURL, openweathermapForecastURL, timezonedbURL } from './third-party-config';
import { weatherIcons } from './weather-icons';
import { removeDuplicates } from './helpers';
import { parseForecastData } from './helpers';

import DateString from './DateString';
import SearchBox from './SearchBox';
import GeoCoordinates from './GeoCoordinates';
import Suntime from './Suntime';
import CityLog from './CityLog';
import CurrentWeather from './CurrentWeather';
import ForecastDay from './ForecastDay';

import './app.scss';

class App extends React.Component {
	state = {
		city: 		{},
		weather: 	{},
		forecast: 	[],
		cityLog: 	[],
		isFetching: false,
	};

	getCityByIP = () => {
		const ipstackRequestParams = {
			access_key: process.env.REACT_APP_IPSTACK_API_KEY,
		}

		const ipstackFetchURL = 
			ipstackURL +  
			Object.keys(ipstackRequestParams).map(key => key + '=' + ipstackRequestParams[key]).join('&');
			 
		//console.log('ipstackFetchURL', ipstackFetchURL);	 
		return fetch(ipstackFetchURL)
			.then(data => {	
				if (data.status === 200){
					console.log('ip data:',data);
					return data.json();
				}
				else{
					console.log('1. SMTH went wronggg');
					// TODO: decide what to do:
					// Option 1: get location from browser navigator
					// Option 2: get location from cookies (last visited city)
					// Option 3: load default location
				}
			})
			.catch(err => console.warn(err)); // TODO: decide what to do:
			// Option 1: get location from browser navigator
			// Option 2: get location from cookies (last visited city)
			// Option 3: load default location
	}


	// search current weather by city id 
	getCurrentWeather = (cityId) => {
		if (cityId === null ){
			console.warn(`Location parameter NOT provided.`);
		
			// TODO: decide what to show to user
			return null;
		}
		const weatherRequestParams = {
			APPID: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
			id: cityId,
			units: 'metric',  // TODO: get units from settings
			lang: 'en_US',    // TODO: decide if there is multy-lang support. Probably, NO?
		}
		
		const weatherFetchURL = 
			openweathermapCurrentURL +  
			Object.keys(weatherRequestParams).map(key => key + '=' + weatherRequestParams[key]).join('&');
		console.log('weatherFetchURL', weatherFetchURL);

		return fetch(weatherFetchURL)
			.then(data => {	
				if (data.status === 200){
					console.log('weather data:',data);
					return data.json();
				}
				else if (data.status === 404){
					console.log('2. status: 404');
					//this.setState({ error: `City not found.`});
					return null;
				}
				else{
					console.log('2. SMTH went wronggg');
					return null;
					//this.setState({ error: `Error while fetching weather.`});
					// TODO: decide what to do
				}
			})
			.catch(err => console.warn(err));
	}

	// get 5 days weather forcast
	getWeatherForecast = (cityId) => {
		if (cityId === null ){
			console.warn(`Location parameter NOT provided.`);
			// TODO: decide what to show to user
			return null;
		}
		const forecastRequestParams = {
			APPID: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
			id: cityId,
			units: 'metric',  // TODO: get units from settings
			lang: 'en_US',    // TODO: decide if there is multy-lang support. Probably, NO?
		}
		
		const forecastFetchURL = 
			openweathermapForecastURL +  
			Object.keys(forecastRequestParams).map(key => key + '=' + forecastRequestParams[key]).join('&');
		//console.log('forecastFetchURL', forecastFetchURL);

		return fetch(forecastFetchURL)
			.then(data => {	
				if (data.status === 200){
					//console.log('forecast data:',data);
					return data.json();
				}
				else if (data.status === 404){
					console.log('7. status: 404');
					//this.setState({ error: `City not found.`});
					return null;
				}
				else{
					console.log('8. SMTH went wronggg');
					return null;
					//this.setState({ error: `Error while fetching weather.`});
					// TODO: decide what to do
				}
			})
			.catch(err => console.warn(err));
	}

	getGMTOffsetByCoordinates = (lat, lng) => {
		const timezonedbRequestParams = {
			key: process.env.REACT_APP_TIMEZONEDB_API_KEY,
			by: `position`,
			lat,
			lng,
			format: `json`,
		}

		const gmtOffsetFetchURL = 
			timezonedbURL +  
			Object.keys(timezonedbRequestParams).map(key => key + '=' + timezonedbRequestParams[key]).join('&');

		return fetch(gmtOffsetFetchURL)
			.then(data => {	
				if (data.status === 200){
					console.log('ip data:',data);
					return data.json();
				}
				else{
					console.log('3. SMTH went wronggg');
					// TODO: 
					// do NOT show Sunrise and Sunset time
				}
			})
			.catch(err => console.warn(err)); // TODO: do NOT show Sunrise and Sunset time
	}

	addCityToLog = (cityData, timezoneData = null) => {
		if (timezoneData){
			cityData.gmtOffset = timezoneData.gmtOffset;
		}
		
		const currentCityLog = Array.from(this.state.cityLog || []);

		if (currentCityLog.length > 0){
			if (currentCityLog[0].id === cityData.id){
				return;
			}
		}
		
		currentCityLog.unshift(cityData);
		const uniqueCityLog = removeDuplicates(currentCityLog);

		if (uniqueCityLog.length > 5){
			uniqueCityLog.splice(-1, 1);
		}

		this.setState({ cityLog: uniqueCityLog });
		localStorage.setItem(`cityLog`, JSON.stringify(uniqueCityLog));
	}

	setCityData = (cityData, timezoneData = null) => {
		
		if (timezoneData && !cityData.gmtOffset){
			cityData.gmtOffset = timezoneData.gmtOffset;
		}
		this.setState({ city: cityData });
	}
	
	setWeatherData = (data) => {
		if (!data){
			return;
		}
		const weatherData = {
			date: 			data.dt,
			sunrise: 		data.sys.sunrise,
			sunset: 		data.sys.sunset,
			lat: 			data.coord.lat,
			lon: 			data.coord.lon,
			icon: 			data.weather[0].icon,
			description: 	data.weather[0].description,
			humidity: 		data.main.humidity,
			windDir:  		Math.round(parseFloat(data.wind.deg)),
			windSpeed: 		Math.round(parseFloat(data.wind.speed)),
			temp: 			Math.round(parseFloat(data.main.temp)),
		};
		this.setState({ weather: weatherData });
	}

	setForecastData = (data) => {
		console.log('Forecast: ', data);
		if (!data){
			return;
		}
		if (data.list.length === 0){
			return;
		}
		const forecastData = data.list.map(item => {
			return {
				date: item.dt,
				icon: item.weather[0].icon,
				description: item.weather[0].description,
				tempMax: Math.round(parseFloat(item.main.temp_max)),
				tempMin: Math.round(parseFloat(item.main.temp_min)),
				windDir: item.wind.deg,
				windSpeed: Math.round(parseFloat(item.wind.speed)),
			}
		});
		
		this.setState({ forecast: parseForecastData(forecastData) });
	}

	getCityLogFromLocalStorage = () => {
		if (this.state.cityLog.length === 0){
			const cityLog = JSON.parse(localStorage.getItem(`cityLog`));
			return cityLog;
		}
		return null;
	}

	loadWeatherForCity = async (cityData) => {
		this.setState({ isFetching: true });
		
		const weatherData = await this.getCurrentWeather(cityData.id);

		if (weatherData.error){
			// TODO: what to do if error
			this.setState({ isFetching: false });
			return;
		}

		let gmtOffset = null; 
		if (!cityData.gmtOffset && weatherData.hasOwnProperty('coord')){
			gmtOffset = await this.getGMTOffsetByCoordinates(weatherData.coord.lat, weatherData.coord.lon);
		}

		this.setCityData(cityData, gmtOffset);
		this.setWeatherData(weatherData);
		this.addCityToLog(cityData, gmtOffset);
		this.setState({ isFetching: false });


		const forecastData = await this.getWeatherForecast(cityData.id);
		console.dir('❎forecastData: ', forecastData);

		if (forecastData.error){
			// TODO: what to do if error
			return;
		}
		this.setForecastData(forecastData);
	}


	async componentDidMount(){
		let cityLog = null;
		let cityData = null;

		// check if there is a city data in localStorage:
		if (localStorage.getItem(`cityLog`) !== null){
			cityLog = this.getCityLogFromLocalStorage();
			cityData = cityLog[0];
		}
		// if not - define city by user's IP:
		else{
			const cityRespose = await this.getCityByIP();
			console.log(cityRespose);
			cityData = {
				id: 			cityRespose.location.geoname_id,
				cityName: 		cityRespose.city,
				countryCode: 	cityRespose.country_code,
			};
		}

		this.setState({ cityLog });
		this.loadWeatherForCity(cityData);
	}



	render() {
		return (
			<div className="app">

				<section className="current-section">
					<DateString seconds={this.state.weather.date}
								keepComma={true} />

					<CityLog cityList={this.state.cityLog}
							loadWeatherForCity={this.loadWeatherForCity} />

					<SearchBox city={this.state.city}
							loadWeatherForCity={this.loadWeatherForCity}/>

					<GeoCoordinates lat={this.state.weather.lat}
									lon={this.state.weather.lon}/>

					<Suntime sunrise={this.state.weather.sunrise}
							sunset={this.state.weather.sunset}
							gmtOffset={this.state.city.gmtOffset}/>

					<CurrentWeather weather={this.state.weather}
									settings={{units: 'metric'}}/> {/*  //TODO:get from state.settings  */} 
					
									
					<div className="error">
						{/*  //TODO: error handling */} 
						
					</div>
					{
						this.state.isFetching
							?  <div className="loader">
									<img src={weatherIcons['loader']} alt="Please wait..."/>
								</div>
							: null
					}
				</section>

				<section className="forecast-section">
					{
						this.state.forecast.map((item, i) => 
							<ForecastDay key={i} 
										 forecast={item}
										 settings={{units: 'metric'}} /> 
						)                                                /* //TODO: take units from state  */
					}
				</section>

			</div>
		);
	}
}

export default App;


// TODO:

// 1. Error handling (if API returns error/empty response)
// 2. Add React animations - ???
// 3. NotFound error popup?? 

// 4. When weather for requested city is loaded, change URL to specific weatherID
// 5. add settings (lang, units)
// 6. <ForecastDay key={i} />     => generate some unique value
// 7. fetch random image from unsplash for background
