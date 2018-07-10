import React from 'react';


import { ipstackURL, openweathermapCurrentURL, openweathermapForecastURL, timezonedbURL } from './third-party-config';

import { removeDuplicates } from './helpers';
import { parseForecastData } from './helpers';
import { weatherIcons } from './weather-icons';

import MainSection from './MainSection';
import ForecastSection from './ForecastSection';
import Footer from './Footer';

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
			units: this.props.settings.units,  
			lang: 'en_US',    // TODO: decide if there is multy-lang support. Probably, NO?
		}
		
		const weatherFetchURL = 
			openweathermapCurrentURL +  
			Object.keys(weatherRequestParams).map(key => key + '=' + weatherRequestParams[key]).join('&');
		//console.log('weatherFetchURL', weatherFetchURL);

		return fetch(weatherFetchURL)
			.then(data => {	
				if (data.status === 200){
					//console.log('weather data:',data);
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
			units: this.props.settings.units,
			lang: 'en_US',    // TODO: decide if there is multy-lang support. Probably, NO?
		}
		
		const forecastFetchURL = 
			openweathermapForecastURL +  
			Object.keys(forecastRequestParams).map(key => key + '=' + forecastRequestParams[key]).join('&');
		console.log('forecastFetchURL', forecastFetchURL);

		return fetch(forecastFetchURL)
			.then(data => {	
				if (data.status === 200){
					console.log('forecast data:',data);
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
			id: 			data.id,
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
		//console.log('Forecast: ', data);
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

		if (!weatherData){
			// TODO: what to do if error
			this.setState({ isFetching: false });
			return;
		}

		let gmtOffset = null; 
		if (!cityData.gmtOffset && weatherData.hasOwnProperty('coord')){
			gmtOffset = await this.getGMTOffsetByCoordinates(weatherData.coord.lat, weatherData.coord.lon);
		}

		if (!cityData.cityName || !cityData.countryCode){
			cityData.cityName = weatherData.name;
			cityData.countryCode = weatherData.sys.country;
		}

		this.setCityData(cityData, gmtOffset);
		this.setWeatherData(weatherData);
		this.addCityToLog(cityData, gmtOffset);
		this.setState({ isFetching: false });


		const forecastData = await this.getWeatherForecast(cityData.id);
		console.log('❎forecastData: ', forecastData);

		if (forecastData.error){
			// TODO: what to do if error
			return;
		}
		this.setForecastData(forecastData);
		//console.log('ROUTR', this.props);
		this.props.history.push(`/${cityData.id}`);
	}


	async componentDidMount(){

		let cityLog = null;
		let cityData = null;

		// check if there is a city data in localStorage:
		if (localStorage.getItem(`cityLog`) !== null){
			cityLog = this.getCityLogFromLocalStorage();
			cityData = cityLog[0];
		}

		const path = this.props.match.path;

		switch (path){
			// option 1 -load weather for either cached city (if exists) or define city from user's IP address:
			case "/": 
				// if there's no cache, define city by IP:
				if (!cityData){
					const cityRespose = await this.getCityByIP();
					console.log(cityRespose);
					cityData = {
						id: 			cityRespose.location.geoname_id,
						cityName: 		cityRespose.city,
						countryCode: 	cityRespose.country_code,
					};
				}
				break;

			// option 2 - load weather for a specified city id:
			case "/:id": 
				cityData = {
					id: 			parseInt(this.props.match.params.id, 10),
					cityName: 		null,
					countryCode: 	null,
				};
				break;
		}
		

		this.setState({ cityLog });
		this.loadWeatherForCity(cityData);
	}

	showError = () => {
		//console.log('SHOW?', 
			// this.state.weather ? '1':'0',
			// Object.getOwnPropertyNames(this.state.weather).length !== 0 ? '1':'0',
			// this.state.weather.id === this.state.city.id  ? '1':'0',
			// !this.state.isFetching ? '1':'0' );

		//console.log('w.id, c.id: ', this.state.weather.id, this.state.city.id); 


		if (this.state.weather 
				&& Object.getOwnPropertyNames(this.state.weather).length !== 0
				&& this.state.weather.id === this.state.city.id
				&& !this.state.isFetching){
					return false;
				}
		return true;
	}


	render() {

		
		//console.log('showError', this.showError());
		return (
			<div className="app">
				{
					this.showError() 
						? 
							this.state.isFetching
								? 
									<div className="loader">
										<img src={weatherIcons['loader']} alt="Please wait..."/>
									</div>
								:
									<div className="error">ERROR</div>
						
						: 
							<React.Fragment>
								<MainSection
									city={this.state.city}
									weather={this.state.weather}
									cityLog={this.state.cityLog}
									settings={this.props.settings}
									isFetching={this.state.isFetching}
									loadWeatherForCity={this.loadWeatherForCity} />

								<ForecastSection 
									forecast={this.state.forecast}
									settings={this.props.settings}/>
									
								<Footer />
							</React.Fragment>
				}
				
			</div>
		);
	}
}

export default App;


// TODO:

// 1. Error handling (if API returns error/empty response)
// 2. Add React animations - ???
// 3. NotFound error popup?? 

// 5. Check all proptypes (wind.js - expected units, but received settings
//						   some components - proptypes are completely missing)
// 6. <ForecastDay key={i} />     => generate some unique value
// 7. fetch random image from unsplash for background
// move all components to /components folder, correct all paths
// 8. add Not Found component ???
// 9. add Feedback component ???
