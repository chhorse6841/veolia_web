/*jshint esversion: 6 */

import {createStore, compse} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';


import rootReducer from './reducers/index';


const defaultState = {
    
};

const store = createStore(rootReducer,defaultState);



export default store;

