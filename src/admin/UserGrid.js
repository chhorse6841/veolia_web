import React from 'react';
import {languageObject} from '../config/config'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {Checkbox,FormControlLabel,	Select,	MenuItem} from '@material-ui/core/';
class UserGrid extends React.Component {
	constructor(props) {
		super();

		this.state = { ...this.state, editCustomerForm: { editUserFormOpen: false, editCustomer: '',editAdmin:'',editLanguage:'',editUser: '' } };
	}
	componentDidMount() {
		this.users = this.props.users.users;
		console.log(this.users);
	}

	//  const jwtToken = props.authData.signInUserSession.idToken.getJwtToken();
	deleteUser(username) {
		const formValues = { email: username };
		this.props.deleteUser(formValues);
	}

	handleEditFormOpen(user) {
		const customers = user.Attributes.find((r) => r.Name == 'custom:customers');
		const isAdmin = user.Attributes.find((r) => r.Name == 'custom:isAdmin')??{Value:'0'};
		const language = user.Attributes.find((r) => r.Name == 'custom:language')??{Value:'1'};

		this.setState({
			...this.state,
			editCustomerForm: {
				editUserFormOpen: true,
				editCustomer: customers ? customers.Value : '',
				editAdmin: isAdmin.Value,
				editLanguage: language.Value,
				editUser: { ...user },
			},
		});
	}

	setCurrentEditCustomer(e) {
		this.setState({ ...this.state, editCustomerForm: { ...this.state.editCustomerForm, editCustomer: e } });
	}

	setCurrentEditAdmin(e) {
		this.setState({ ...this.state, editCustomerForm: { ...this.state.editCustomerForm, editAdmin: e.target.checked?'1':'0' } });
	}

	setCurrentEditLanguage(e) {
		this.setState({ ...this.state, editCustomerForm: { ...this.state.editCustomerForm, editLanguage: e } });
	}

	handleEditFormSubmit(e) {
		const {editCustomer,editAdmin,editLanguage} = this.state.editCustomerForm;
		const form = { ...this.state.editCustomerForm.editUser, customer: editCustomer,isAdmin:editAdmin,language:editLanguage };
		this.props.updateCustomer(form);
		this.setState({ ...this.state, editCustomerForm: { editUserFormOpen: false, editCustomer: '',editAdmin:'',editLanguage:'',editUser: ''} });
	}

	handleEditFormClose = () => {
		this.props.resetfailed();
		this.setState({ ...this.state, editCustomerForm: { editUserFormOpen: false, editCustomer: '',editAdmin:'',editLanguage:'',editUser: '' } });
	}

	renderSuccess = () => {
		const t = this.props.t;
		return (
			<Snackbar open={!this.props.users.error} autoHideDuration={6000}>
				<Alert severity="success">{t(`This is a success message!`)}</Alert>
			</Snackbar>
		);
	};

	render() {
		const users = this.props.users.users;
		const t = this.props.t;
		return (
			<div>
				{this.renderSuccess}
				
				<TableContainer component={Paper}>
					<Table size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>{t('Email')}</TableCell>
								<TableCell align="left">{t('Name')}</TableCell>
								<TableCell align="left">{t('Created At')}</TableCell>
								<TableCell align="left">{t('Last Modified')}</TableCell>
								<TableCell align="left">{t('Status')}</TableCell>
								<TableCell align="left">{t('Enabled')}</TableCell>
								<TableCell align="left">{t('Overview')}</TableCell>
								<TableCell align="left">{t('Actions')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users?.map((row) => {
								const email = row.Attributes.find((r) => r.Name == 'email');
								const isAdmin = row.Attributes.find((r) => r.Name == 'custom:isAdmin')??{Value:'0'};
								const language = row.Attributes.find((r) => r.Name == 'custom:language')??{Value:'1'};
								const customers = row.Attributes.find((r) => r.Name == 'custom:customers')??{Value:''};
								const name = row.Attributes.find((r) => r.Name == 'custom:name')??{Value:''};
								console.log(email);
								return (
									<TableRow key={row.Username}>
										<TableCell component="th" scope="row">
											{email ? email.Value : ''}
										</TableCell>
										<TableCell align="left">{name.Value}</TableCell>
										<TableCell align="left">{row.UserCreateDate}</TableCell>
										<TableCell align="left">{row.UserLastModifiedDate}</TableCell>
										<TableCell align="left">{row.UserStatus}</TableCell>
										<TableCell align="left">{row.Enabled ? t(`Enabled`) : t(`Disabled`)}</TableCell>

										<TableCell align="left">
											Language: {languageObject[language.Value]}<br/>
											Admin: {isAdmin.Value=='1'? t(`YES`):t(`NO`)}<br/>
											Customers: {customers.Value}<br/>
										</TableCell>
										<TableCell align="left">
											<DeleteIcon onClick={() => this.deleteUser(row.Username)} />
											<EditIcon onClick={() => this.handleEditFormOpen(row)} />
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<Dialog
					open={this.state.editCustomerForm.editUserFormOpen}
					onClose={this.handleEditFormClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">{t(`Update User`)}</DialogTitle>
					<DialogContent>
						<DialogContentText>{t(`Please enter the details here to update user.`)}</DialogContentText>
						<form>
							{this.props.error ? (
								<Alert severity="error">
									<AlertTitle>{t(`Error`)}</AlertTitle>
									{this.props.error}
								</Alert>
							) : (
								''
							)}

							<TextField
								autoFocus
								margin="dense"
								id="customers"
								label={t(`Customer`)}
								type="text"
								value={this.state.editCustomerForm.editCustomer}
								onChange={(e) => this.setCurrentEditCustomer(e.target.value)}
								fullWidth
							/>

							<FormControlLabel
									control={
									<Checkbox
										
										checked={this.state.editCustomerForm.editAdmin=='1'?true:false}
										name="isAdmin"
										color="primary"
										value={this.state.editCustomerForm.editAdmin}
										onChange={(e)=>this.setCurrentEditAdmin(e)}
									/>

									}
									label={t(`Admin`)}
								/>

<Select
					label={t(`Language`)}
					margin="dense"
					variant="outlined"
					labelId="demo-simple-select-label"
					defaultValue={this.state.editCustomerForm.editLanguage}
					onChange={(e) => this.setCurrentEditLanguage(e.target.value)}
					displayEmpty={false}
					id="demo-simple-select"
					fullWidth
				>
					<MenuItem selected>{t(`Select Language`)}</MenuItem>
					<MenuItem value="1">English</MenuItem>
					<MenuItem value="2">Français</MenuItem>
					<MenuItem value="3">Nederlands</MenuItem>
					<MenuItem value="4">German</MenuItem>
				</Select>


						</form>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.handleEditFormClose()} color="primary">
							{t(`Cancel`)}
						</Button>
						<Button color="primary" onClick={(e) => this.handleEditFormSubmit(e)}>
							{t(`Save`)}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default UserGrid;
