import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Alert, AlertTitle } from '@material-ui/lab';
import Box from "@material-ui/core/Box";

class AddUser extends React.Component {
	constructor() {
		super();

		this.state = {
			...this.state,
			addCustomerForm: {
				password: '',
				emailAddress: '',
				customer: '',
				isAdmin: 0,
				name: '',
				error: 0,
				success: 0,
				open: false,
			},
		};
	}

	handleClose = () => {
		this.props.resetfailed();
		this.setState({
			...this.state,
			error: '',
			addCustomerForm: {
				password: '',
				emailAddress: '',
				customer: '',
				name: '',
				isAdmin: 0,
				error: 0,
				success: 0,
				open: false,
			},
		});
	};
	handleSubmit = async () => {
		const formValues = { ...this.state.addCustomerForm };
		if (
			!this.state.addCustomerForm.password ||
			!this.state.addCustomerForm.emailAddress ||
			!this.state.addCustomerForm.customer ||
			!this.state.addCustomerForm.name
		) {
			this.setState({ ...this.state, addCustomerForm: { error: 1, ...this.state.addCustomerForm } });
			return;
		}
		this.props.createUser(formValues);
		this.setState({ ...this.state, addCustomerForm: { success: 1, ...this.state.addCustomerForm } });
	};
	handleClickOpen = () => {
		this.setState({
			...this.state,
			addCustomerForm: {
				password: '',
				emailAddress: '',
				customer: '',
				name: '',
				isAdmin: 0,
				error: 0,
				success: 0,
				open: true,
			},
		});
	};

	resetForm = () => {
		this.setState({
			...this.state,
			addCustomerForm: {
				password: '',
				emailAddress: '',
				customer: '',
				name: '',
				isAdmin: 0,
				error: 0,
				success: 0,
				open: false,
			},
		});
	};

	updatePassword(e) {
		console.log(e.target.checked);
		this.setState({ ...this.state, addCustomerForm: { ...this.state.addCustomerForm, password: e.target.value } });
	}

	updateEmail(e) {
		this.setState({
			...this.state,
			addCustomerForm: { ...this.state.addCustomerForm, emailAddress: e.target.value },
		});
	}

	updateCustomers(e) {
		this.setState({ ...this.state, addCustomerForm: { ...this.state.addCustomerForm, customer: e.target.value } });
	}

	updateIsAdmin(e) {
		this.setState({
			...this.state,
			addCustomerForm: { ...this.state.addCustomerForm, isAdmin: e.target.checked ? '1' : '0' },
		});
	}

	updateName(e) {
		this.setState({ ...this.state, addCustomerForm: { ...this.state.addCustomerForm, name: e.target.value } });
	}
	render() {
		const t = this.props.t;

		return (
			<div>
				<Box display="flex" flexDirection="row" justifyContent="center">
					<Button variant="contained" align="left" className="redButton" onClick={() => this.handleClickOpen()}>
						{t(`ADD USER`)}
					</Button>
					&nbsp;&nbsp;&nbsp;
					<Button variant="contained" align="right" className="redButton" onClick={() => this.props.history.push('/customer')}>
						{t(`Task Overview`)}
					</Button>
				</Box>
				
				<Dialog
					open={this.state.addCustomerForm.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">{t(`Add New User`)}</DialogTitle>
					<DialogContent>
					<DialogContentText>{t(`Please enter the details here to update user.`)}</DialogContentText>
						<form>
							{this.props.error ? (
								<Alert severity="error">
									<AlertTitle>{t(`error`)}</AlertTitle>
									{this.props.error}
								</Alert>
							) : (
								''
							)}
							<TextField
								autoFocus
								margin="dense"
								name="name"
								label={t(`Name`)}
								type="text"
								value={this.state.addCustomerForm.name}
								onChange={(e) => this.updateName(e)}
								fullWidth
							/>
							<TextField
								autoFocus
								margin="dense"
								name="emailAddress"
								label="Email"
								type={t(`Email`)}
								value={this.state.addCustomerForm.emailAddress}
								onChange={(e) => this.updateEmail(e)}
								fullWidth
							/>

							<TextField
								autoFocus
								margin="dense"
								name="password"
								label={t(`Password`)}
								type="password"
								value={this.state.addCustomerForm.password}
								onChange={(e) => this.updatePassword(e)}
								fullWidth
							/>
							<TextField
								autoFocus
								margin="dense"
								id="customers"
								label={t(`Customer`)}
								type="text"
								value={this.state.addCustomerForm.customer}
								onChange={(e) => this.updateCustomers(e)}
								fullWidth
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="isAdmin"
										color="primary"
										value={this.state.addCustomerForm.isAdmin}
										onChange={(e) => this.updateIsAdmin(e)}
									/>
								}
								label={t(`Admin`)}
							/>
						</form>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleClose()} color="primary">
							{t(`Cancel`)}
						</Button>
						<Button color="primary" onClick={() => this.handleSubmit()}>
							{t(`Create`)}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default AddUser;
