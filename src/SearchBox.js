import React from 'react';
import PropTypes from 'prop-types';

import { openweathermapAutocompleteURL } from './third-party-config';
import { weatherIcons } from './weather-icons';

import './search-box.scss';

class SearchBox extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            searchSuggestions: [],
            searchValue: '',
            city: props.city,
            searchTip: false
        };

        //this.suggestionsList = React.createRef();
    }

    getCitySuggestions = (word) => {
        const autocompleteRequestParams = {
            APPID: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
            q: word
		};

		const autocompleteFetchURL = 
            openweathermapAutocompleteURL +  
			Object.keys(autocompleteRequestParams).map(
                key => key + '=' + autocompleteRequestParams[key]).join('&');

        return fetch(autocompleteFetchURL)
            .then(data => {	
                if (data.status === 200){
                    //console.log('autocomplete data:',data);
                    return data.json();
                }
                else{
                    // This happens when we receive Internal server error
                    // TODO: add some error messages for this case
                    console.log('4. SMTH went wronggg');
                    return null;
                }
            })
            .then(suggestions => {
                //console.log('5. suggestions:', suggestions);
                if (suggestions.cod === "200" && suggestions.list.length > 0){
                    return suggestions.list.map(item => { 
                                                return { 
                                                    id: item.id, 
                                                    city: item.name, 
                                                    country: item.sys.country,
                                                } 
                                            });
                } 
                else{
                    console.log('5. SMTH went wronggg');
                    return [];
                }
            })
            .catch(err => console.warn(err));
    }

    setCitySuggestions = (citySuggestions) => {
        this.setState({ searchSuggestions: citySuggestions });
    }

    // fetch and show city suggestions as user types:
    typingHandler = async (e) => {
        this.setState({ searchValue: e.target.value });

        if (e.target.value.length <= 2){
            this.setCitySuggestions([]);
        }

        if (e.target.value.length > 2){
            const cityList = await this.getCitySuggestions(e.target.value);
            this.setCitySuggestions(cityList);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    // once user selects one of the items from the list of city suggestions
    // we send selected city data to parent element, parent element will 
    // then fetch weather data for that city based on cityId
    handleCityClick = (e) => {
        const word = `${e.target.dataset["city"]}, ${e.target.dataset["country"]}`;
        this.setState({ searchValue: word });

        const selectedCity = {
            id:             parseInt(e.target.dataset["id"], 10),
            cityName:       e.target.dataset["city"],
            countryCode:    e.target.dataset["country"],
        };
        this.setState({ city: selectedCity });

        //console.log('selected city: ',word, e.target.dataset["id"]);
        this.setCitySuggestions([]);

        this.props.loadWeatherForCity(selectedCity);

        //console.log('ROUTR', this.props);
    }

    mouseOverCity = (e) => {
        const index = this.state.searchSuggestions.findIndex(item => item.id === parseInt(e.target.dataset['id'], 10));
        this.markSelected(index);
    }

    focusHandler = (e) => {
        e.target.value = '';
    }

    blurHandler = (e) => {
        if (e.target.value === ''){
            e.target.value = 
                this.state.searchValue
                    ? this.state.searchValue
                    : this.getInputValue(this.state.city);
        }
    }

    getInputValue = (cityData) => {
        return `${cityData.cityName}, ${cityData.countryCode}`;
    }

    markSelected = (index) => {
        const suggestions = Array.from(this.state.searchSuggestions)
                                .map(item => {
                                    item.selected = false;
                                    return item;
                                });
        suggestions[index].selected = true;
        this.setState({ searchSuggestions: suggestions });
    }

    parseSearchValue = (value) => {
        const words = value.trim().split(',');
        if (words.length === 1){
            return { 
                city: words[0],
                country: null,
            };
        }
        if (words.length === 2){
            return { 
                city: words[0],
                country: words[1],
            };
        }
    }

    showSearchTip = (searchValue) => {
        if (this.state.searchSuggestions.length === 0 && !this.parseSearchValue(searchValue).country ){
            this.setState({ searchTip: true });
        }
        else{
            this.setState({ searchTip: false });
        }
    }

    hideSearchTip = (searchValue) => {
        if (this.state.searchTip){
            if (this.state.searchSuggestions.length !== 0 || this.parseSearchValue(searchValue).country ){
                this.setState({ searchTip: false });
            }
        }
    }

    inputKeyDownHandler = (e) => {
        this.hideSearchTip(e.target.value);

        //const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
        if (e.keyCode === 40){
            e.preventDefault();
            const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
            //console.log('selectedIndex', selectedIndex);
            if (selectedIndex === this.state.searchSuggestions.length - 1){
                this.markSelected(0);
                return;
            }
            this.markSelected(selectedIndex+1);
        }
        else if (e.keyCode === 38){
            e.preventDefault();
            const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
            //console.log('selectedIndex', selectedIndex);
            if (selectedIndex === 0){
                this.markSelected(this.state.searchSuggestions.length - 1);
                return;
            }
            this.markSelected(selectedIndex-1);
        }
        else if (e.keyCode === 13){
            const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
            if (selectedIndex !== -1){
                const selected = this.state.searchSuggestions[selectedIndex];
                console.log('selected: ',selected);

                const word = `${selected.city}, ${selected.country}`;
                

                const selectedCity = {
                    id:             selected.id,
                    cityName:       selected.city,
                    countryCode:    selected.country,
                };
                
                this.setState({ 
                    searchValue: word,
                    city: selectedCity 
                });

                this.setCitySuggestions([]);

                this.props.loadWeatherForCity(selectedCity);
                //console.log('ROUTR', this.props);
            }
            else{
                this.showSearchTip(e.target.value);
            }
        }
        else if (e.keyCode === 27){
            e.preventDefault();

            this.setState({ searchValue: this.getInputValue(this.state.city) });
            this.setCitySuggestions([]);

            e.target.blur();
        }
    }

    // set initial value of search input to props.city
    // once props.city value is assigned
    // since once props.city value is assigned asyncronously (thus with delay) we need this method
    componentDidUpdate(prevProps){

        // if previously city in props was empty AND ( there is NO cityId, but there is cityId in props)
        // OR there is cityId and cityId in props, AND these 2 cityIDs are not same
        console.log(prevProps.city);
        console.log(Object.keys(prevProps.city).length === 0, 
                                !this.state.city.id && this.props.city.id,
                                this.state.city.id && this.props.city.id,
                                this.state.city.id !== this.props.city.id
                            );
        // if ((Object.keys(prevProps.city).length === 0) && (!this.state.city.id && this.props.city.id)
        //     || (this.state.city.id && this.props.city.id && (this.state.city.id !== this.props.city.id))){
        //     this.setState({ 
        //         city: this.props.city, 
        //         searchValue: this.getInputValue(this.props.city)
        //     });
        // }

        if (this.props.city.id !== this.state.city.id || this.state.searchValue.length === 0){
            this.setState({ 
                city: this.props.city, 
                searchValue: this.getInputValue(this.props.city)
            });
            console.log('Set');
        }
        
    }

    render() {
        const selectedStyle = {
            background: 'rgb(26, 176, 211)',
            color: 'white'
		}
        return(
            <div className="search-box">
                {
                    this.state.searchTip
                        ? <div className="tip">
                              <span className="info">ℹ</span> 
                              Consider adding country code for best search results.
                              Example: <span className="example">London, UK</span>
                          </div>
                        : null
                }
                <form className="search-form" onSubmit={this.handleSubmit}>
                    <input type="text" 
                           autoComplete="false"
                           autoCorrect="false"
                           autoCapitalize="false"
                           spellCheck={false}
                           value={this.state.searchValue}
                           onKeyDown={this.inputKeyDownHandler}
                           onChange={this.typingHandler}
                           onFocus={this.focusHandler}
                           onBlur={this.blurHandler}/>
                    <img src={weatherIcons['pen']}  alt="Enter city"/>
                </form>
            
                <div className="suggestions-wrapper">
                    <ul className="city-suggestions">
                        {this.state.searchSuggestions.map((item,i) => <li key={`${item.id}_${i}`}
                                                                        data-id={item.id} 
                                                                        data-city={item.city}
                                                                        data-country={item.country}
                                                                        onClick={this.handleCityClick}
                                                                        onMouseOver={this.mouseOverCity}
                                                                        style={
                                                                            item.selected
                                                                                ? selectedStyle
                                                                                : null
                                                                        }>
                                                                        {item.city}, {item.country}
                                                                    </li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    city: PropTypes.shape({
        id: 			PropTypes.number,
		cityName: 		PropTypes.string,
        countryCode:    PropTypes.string,
        gmtOffset:      PropTypes.number,
    }).isRequired,
    loadWeatherForCity: PropTypes.func.isRequired,
};

export default SearchBox;