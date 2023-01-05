import React from 'react';

import CustomerMain from './CustomerMain';
import { Route, Switch } from 'react-router';

import AuthenticationLayout from '../Common/AuthenticatedLayout';

class Customer extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
	}
	render() {
		return (
			<Switch>
				<Route path="/">
					<AuthenticationLayout>
						<CustomerMain></CustomerMain>
					</AuthenticationLayout>
				</Route>

			
			</Switch>
		);
	}
}

export default Customer;
