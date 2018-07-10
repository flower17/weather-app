import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import AppRouter from './AppRouter';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter >
        <AppRouter />
    </BrowserRouter>, 
document.getElementById('root'));

registerServiceWorker();
