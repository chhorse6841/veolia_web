import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux'; // we need this for react-router
import jira from './jira';
import users from './users';
import details from './details';
import authentication from './authentication';

// Combine all our reducers togeher
const rootReducer = combineReducers({users,jira,details,authentication, routing: routerReducer });

export default rootReducer;