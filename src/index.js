import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import { Provider } from 'react-redux';
import store from './store';
import Customer from './customer/Customer';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Landing from './Landing';
import Signin from './Authentication/SignIn';
import Signup from './Authentication/Signup';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AuthenticationLayout from './Common/AuthenticatedLayout';
import IssueDetails from './customer/IssueDetails';
	
import './fonts/HelveticaLTStd-Light.otf';

Amplify.configure(config);

const router = (

	<Provider store={store}>
		<I18nextProvider i18n={ i18n }>
		<Router>
			<Switch>
				<Route path="/admin">
					<App />
				</Route>
				<Route path="/customer">
					<Customer />
				</Route>
				<Route exact path="/">
	

					<Landing/>


				</Route>
				<Route exact path="/signin">
					<Signin/>
				</Route>
				{/* <Route exact path="/signup">
					<Signup />
				</Route> */}

				<Route path="/issue/details/:id">
					<AuthenticationLayout>
						<IssueDetails></IssueDetails>
					</AuthenticationLayout>
				</Route>
				
			</Switch>
		</Router>
		</I18nextProvider>
	</Provider>
);

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
