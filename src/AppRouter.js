import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from './App';
import Settings from './Settings';

class AppRouter extends React.Component{
    constructor(){
        super();
        let settings = JSON.parse(localStorage.getItem(`settings`));
        if (!settings){
            settings = { units: 'metric' };
        }
        this.state = { settings };
    }

    updateSettings = value => {
        //console.log('this.state.settingsBEFORE', this.state.settings);
        //console.log('value', value);
        const settings = {units: value};
        this.setState({ settings });
        localStorage.setItem(`settings`, JSON.stringify(settings));
        //console.log('this.state.settingsAFTER', this.state.settings);
    }

    render(){
        
        return (
            <Switch> 
                <Route exact path='/' 
                             render={ ({match, history})=>(<App settings={this.state.settings}
                                                                history={history}
                                                                match={match}/>) } />

                <Route exact strict path='/settings' 
                                    render={ ({history})=>(<Settings settings={this.state.settings}
                                                                     updateSettings={this.updateSettings} 
                                                                     history={history}/>) } />
                <Route path='/:id' 
                        render={ ({match, history})=>(<App settings={this.state.settings}
                            history={history}
                            match={match}/>) } />
                
            </Switch>
        );

    }
}
   

export default AppRouter;