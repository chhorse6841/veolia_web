import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Auth } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import store from '../store';
import { connect } from 'react-redux';
import * as AuthenticationActions from '../actions/AuthenticationActions';
import { bindActionCreators } from 'redux';
import Link from '@material-ui/core/Link';
import { Progress } from './Progress';
import { withTranslation } from 'react-i18next';
import Box from "@material-ui/core/Box";
import Input from '@material-ui/core/Input';
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
		color:'#777777',
		fontSize:"1.0rem",
		display:'block',
		backgroundColor:'#f2f2f2',
		textAlign: 'right',
		cursor: 'pointer',
		textDecoration: 'underline',
		fontStyle: 'italic',
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
		borderRadius:"5px",
		width: "260px",
	}
	
});

const mapStateToProps = (store) => {
	return { authentication: store.authentication };
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(AuthenticationActions, dispatch);
};

class SignIn extends React.Component {
	usernameRef = React.createRef();
	passwordRef = React.createRef();
	codeRef = React.createRef();

	constructor(props) {
		super(props);
		this.formValues = {
			username: '',
			password: '',
			code: '',
		};
		this.state = {
			error: false,
			loading: 0,
			needAuthenticationCode: false,
			forgetPassword: false,
			forgetPasswordSet: false,
		};
	}

	handleSubmit = async () => {
		try {
			const { username, password } = this.formValues;
			this.setState({ ...this.state, loading: 1, error: '' });
			await Auth.signIn(username, password);
			const user = await Auth.currentAuthenticatedUser({
				bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
			});
			this.setState({ ...this.state, loading: 0 });
			this.props.storeUser(user.idToken);
			this.props.history.push('/customer');
			console.log(user);
		} catch (err) {
			console.log(err);
			this.setState({ ...this.state, loading: 0 });
			if (err.code === 'UserNotConfirmedException') {
				this.setState({ ...this.state, error: 'User Not Confirmed' });
			} else if (err.code === 'UserNotFoundException') {
				this.setState({ ...this.state, error: 'User Not Found' });
			} else {
				this.setState({ ...this.state, error: 'Email/Password required ' });
			}
		}
	};

	forgetPassword = async () => {
		this.setState({ ...this.state, forgetPassword: true });
	};

	sendResetCode = async () => {
		try {
			const { username } = this.formValues;

			this.setState({ ...this.state, loading: 1, error: '' });
			await Auth.forgotPassword(username);
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, forgetPassword: false, forgetPasswordSet: true });
		} catch (err) {
			console.log(err);
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, error: err.message });
		}
	};

	forgotPasswordSubmit = async () => {
		try {
			const { username, password, code } = this.formValues;

			this.setState({ ...this.state, loading: 1, error: '' });
			await Auth.forgotPasswordSubmit(username, code, password);
			this.setState({ ...this.state, loading: 0 });
			alert('Reset Password Success');
			this.setState({
				error: false,
				loading: 0,
				needAuthenticationCode: false,
				forgetPassword: false,
				forgetPasswordSet: false,
			});
		} catch (err) {
			console.log(err);
			this.setState({ ...this.state, loading: 0 });
			this.setState({ ...this.state, error: err.message });
		}
	};

	cancel = () => {
		this.setState({
			error: false,
			loading: 0,
			needAuthenticationCode: false,
			forgetPassword: false,
			forgetPasswordSet: false,
		});
	};

	changeRef = (name, value) => (this.formValues[name] = value);

	focusPassword = (e) => {
		if (e.keyCode == 13) {
			this.passwordRef.current.focus();
		}
	};

	render() {
		const { classes, t } = this.props;
		if (this.state.loading) return <Progress container={classes.container}></Progress>;

		if (this.state.forgetPassword)
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

				<Container maxWidth="xs" className={classes.container} component={Paper}>
					{this.state.error ? (
						<Alert severity="error">
							<AlertTitle>Error</AlertTitle>
							{this.state.error}
						</Alert>
					) : (
						''
					)}
					<TextField
						InputLabelProps={{ shrink: true }}
						autoFocus
						margin="dense"
						id="key"
						ref={this.usernameRef}
						fullWidth
						onChange={(e) => this.changeRef('username', e.target.value)}
						label={t('Email')}
						type="text"
						variant="outlined"
					/>
					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="redButton width20" onClick={this.sendResetCode}>
							Send Reset Code
						</Button>
					</div>
					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="blackButton width20" onClick={() => {this.cancel();}}>
							Cancel
						</Button>
					</div>
					
					
				</Container>
				</Box>
				</div>
			);

		if (this.state.forgetPasswordSet)
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


				<Container maxWidth="xs" className={classes.container} component={Paper}>
					{this.state.error ? (
						<Alert severity="error">
							<AlertTitle>Error</AlertTitle>
							{this.state.error}
						</Alert>
					) : (
						''
					)}
					<TextField
						InputLabelProps={{ shrink: true }}
						autoFocus
						margin="dense"
						id="key"
						ref={this.passswordRef}
						onChange={(e) => this.changeRef('password', e.target.value)}
						label={`New ${t('Password')}`}
						type="password"
						fullWidth
						variant="outlined"
					/>
					<TextField
						InputLabelProps={{ shrink: true }}
						margin="dense"
						id="key"
						ref={this.codeRef}
						onChange={(e) => this.changeRef('code', e.target.value)}
						label="Confirmation Code"
						type="text"
						fullWidth
						variant="outlined"
					/>
					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="redButton width20" onClick={this.forgotPasswordSubmit}>
							Reset {t('Password')}
						</Button>
					</div>
					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="blackButton width20" onClick={() => {this.cancel();}}>
							Cancel
						</Button>
					</div>
					

				</Container>
				</Box>
			</div>
				
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
					
					<FormControlLabel control={
							<Input
								InputLabelProps={{ shrink: true }}
								autoFocus
								margin="dense"
								id="key"
								ref={this.usernameRef}
								onChange={(e) => this.changeRef('username', e.target.value)}
								onKeyDown={(e) => this.focusPassword(e)}
								label={t('Email')}
								type="text"
								
								disableUnderline={true}
								className="roundedInputs"
							/>
						} labelPlacement="start" className={classes.lables} label="Username">

					</FormControlLabel>

					<FormControlLabel 
						control={
							<Input
								InputLabelProps={{ shrink: true }}
								margin="dense"
								id="key"
								inputRef={this.passwordRef}
								onChange={(e) => this.changeRef('password', e.target.value)}
								onKeyDown={(e) => (e.keyCode === 13 ? this.handleSubmit() : '')}
								label={t('Password')}
								type="password"
								fullWidth
								disableUnderline={true}
								className="roundedInputs"
							/>
						} label="Password" labelPlacement="start" className={classes.lables}>

					</FormControlLabel>
					

					
					<div className="contentCenter marginBottom1">

					<Button fullWidth variant="contained" className="redButton width20" onClick={this.handleSubmit}>
						{t('Log In')}
					</Button>
					</div>
					<div className="contentCenter marginBottom1">
					{/* <Button fullWidth variant="contained" className="blackButton width20" onClick={() => {this.props.history.push('/signup');}}>
						{t('New Account')}
					</Button> */}
					</div>
					<p className={classes.forgetPasswordLink}  onClick={this.forgetPassword}>
							Forgot Password
					</p>
				</Container>
				</Box>
			</div>
		);
	}
}
const signinWithTranslation = withTranslation()(SignIn);
const connected = connect(mapStateToProps, mapDispatchToProps)(signinWithTranslation);
export default withRouter(withStyles(useStyles)(connected));
