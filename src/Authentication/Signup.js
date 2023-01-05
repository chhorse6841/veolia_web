import React from 'react';
import "./login.css";

import {
	Button,
	TextField,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Container,
	Grid,
	Paper,
	Typography,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Auth } from 'aws-amplify';

import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
import {Progress} from './Progress';
import {Confirmationcode} from './Confirmationcode';
import { withTranslation } from 'react-i18next';
import Box from "@material-ui/core/Box";
import logo from './Logo.png'

const useStyles = (theme) => ({
	box: {
		height:'100vh',
		width:'100%',
		position:'fixed',
		  backgroundImage:`url(${"/main.png"})`,
		  backgroundSize:'cover'
  
	  },
	container: {
		marginTop: '5rem',
		padding: '2rem',
		backgroundColor:'#f2f2f2',
		borderRadius:'1rem'
	},
	forgetPasswordLink: {
		color:'#919191',
		fontSize:"0.7rem",
		display:'block',
		margin:'auto'

	},
	authenticationSubText:{
		color:'#979797',
		textAlign:'center',
		fontSize:'1.2rem',
		fontWeight:'bold',
		marginTop:'1rem',
		marginBottom:'1rem',
		wordSpacing:'0.2rem'
		
	},
	logoImage:{
		
		margin:'auto',
		display:'block'
	},
	roundedInputs:{
		borderRadius:"5px"
	}
});

class Signup extends React.Component {
	usernameRef = React.createRef();
	passwordRef = React.createRef();
	languageRef = React.createRef();
	nameRef = React.createRef();
	codeRef = React.createRef();

	constructor(props) {
		super(props);
		this.formValues = {
			username: '',
			password: '',
			language: '',
			name: '',
		};
		this.confirmationCode = '';
		this.state = { error: false, loading: 0, needAuthenticationCode: false };
	}

	handleSubmit = async () => {
		//      e.target.preventDefault();
		try {
			const { name, password, language, username } = this.formValues;
			this.setState({ ...this.state, loading: 1, error: '' });
			const user = await Auth.signUp({
				username,
				password,
				attributes: {
					email: username,
					'custom:language': language, // optional
          'custom:name': name,
          'custom:isAdmin':'0'
					// other custom attributes
				},
				validationData: [], //optional
			});

			this.setState({ ...this.state, loading: 0, needAuthenticationCode: true });
		} catch (err) {
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, error: err.message });
		}
	};

	handleConfirmCode = async () => {
		//      e.target.preventDefault();
		try {
			const code = this.confirmationCode;
			this.setState({ ...this.state, loading: 1, error: '' });
			await Auth.confirmSignUp(this.formValues.username, code, {
				// Optional. Force user confirmation irrespective of existing alias. By default set to True.
				forceAliasCreation: true,
			});

			this.setState({ ...this.state, loading: 0, needAuthenticationCode: true });
			this.props.history.push('/signin');
		} catch (err) {
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, error: err.message });
		}
	};

	handleResendCode = async () => {
		//      e.target.preventDefault();
		try {
			const code = this.confirmationCode;
			this.setState({ ...this.state, loading: 1, error: '' });
			await Auth.resendSignUp(this.formValues.username);

			this.setState({ ...this.state, loading: 0, needAuthenticationCode: true });
		} catch (err) {
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, error: err.message });
		}
	};
	changeRef = (name, value) => (this.formValues[name] = value);
	setConfirmationCode = (value) => (this.confirmationCode = value);

	render() {
		const { classes,t } = this.props;
		if (this.state.loading) return <Progress container={classes.container}></Progress>;

		if (this.state.needAuthenticationCode)
			return (
				<Confirmationcode
					error={this.state.error}
					codeRef={this.codeRef}
					setConfirmationCode={this.setConfirmationCode}
					handleConfirmCode={this.handleConfirmCode}
					handleResendCode={this.handleResendCode}
					container={classes.container}
					marginRight={classes.marginRight}
					
				></Confirmationcode>
			);

		return (
			<div>
			<Box display="flex" flexDirection="row" justifyContent="left">
				<Box p={1} className="headerLogo">
				<img src="/logowhite.png" className="logowhite" alignContent="center" alignItems="center" />

				</Box>
				<Box flexGrow={1} className="headerRest">
					
				</Box>
				</Box>
				<Box className={classes.box} display="flex" flexDirection="column" justifyContent="center">
			<Container maxWidth="xs" className={classes.container} component={Paper} justifyContent="center">
			<img src={logo} className={classes.logoImage} alignContent="center" alignItems="center"></img>
					{this.state.error ? (
						<Alert severity="error">
							<AlertTitle>Error</AlertTitle>
							{this.state.error}
						</Alert>
					) : (
						''
					)}

					<Typography variant="h5" gutterBottom className={classes.authenticationSubText}>
						Manage your stickering project online
					</Typography>
				<TextField
					InputLabelProps={{ shrink: true }}
					autoFocus
					margin="dense"
					id="key"
					ref={this.usernameRef}
					onChange={(e) => this.changeRef('username', e.target.value)}
					label={t("Email")}
					type="email"
					fullWidth
					variant="outlined"
				/>

				<TextField
					InputLabelProps={{ shrink: true }}
					
					margin="dense"
					id="password"
					ref={this.passwordRef}
					onChange={(e) => this.changeRef('password', e.target.value)}
					label={t("Password")}
					type="password"
					fullWidth
					variant="outlined"
				/>

				<TextField
					InputLabelProps={{ shrink: true }}
					
					margin="dense"
					id="key"
					ref={this.nameRef}
					onChange={(e) => this.changeRef('name', e.target.value)}
					label={t("Name")}
					type="text"
					fullWidth
					variant="outlined"
				/>
				

				<Select
					label={t("Language")}
					margin="dense"
					variant="outlined"
					displayEmpty={true}
					label={t('Language')}
					ref={this.languageRef}
					onChange={(e) => this.changeRef('language', e.target.value)}
					id="demo-simple-select"
					fullWidth
				>
					<MenuItem selected>Select Language</MenuItem>
					<MenuItem value="1">English</MenuItem>
					<MenuItem value="2">Français</MenuItem>
					<MenuItem value="3">Nederlands</MenuItem>
				</Select>
				
				<div>
					<Button fullWidth variant="contained" className="redButton width20" onClick={this.handleSubmit}>
						{t('Register')}
					</Button>
				</div>
				<p></p>
				<div>
					<Button fullWidth variant="contained" className="redButton width20" onClick={() => {this.props.history.push('/signin');}}>
						{t('Sign in')}
					</Button>
				</div>
				
			</Container>
				</Box>
				</div>
			
		);
	}
}
const signupWithTranslation = withTranslation()(Signup)
export default withRouter(withStyles(useStyles)(signupWithTranslation));
