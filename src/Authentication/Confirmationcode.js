import React from 'react';
import { Button, TextField, Container, Paper, Typography} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import Box from "@material-ui/core/Box";
import logo from './Logo.png'
import { withStyles } from '@material-ui/core/styles';

const useStyles = (theme) => ({
	// root: {
	// 	'& .MuiTextField-root': {
	// 	  margin: theme.spacing(1),
	// 	  width: '25ch',
	// 	},
	//   },
	// box: {
	// 	height:'100vh',
	// 	width:'100%',
	// 	position:'fixed',
	// 	backgroundImage:`url(${"/main.png"})`,
	// 	backgroundSize:'cover'
	//   },
	// container: {
	// 	marginTop: '5rem',
	// 	padding: '2rem',
	// 	backgroundColor:'#f2f2f2',
	// 	borderRadius:'1rem'
	// },
	// forgetPasswordLink: {
	// 	color:'#919191',
	// 	fontSize:"0.7rem",
	// 	display:'block',
	// 	margin:'auto'

	// },
	// authenticationSubText:{
	// 	color:'#979797',
	// 	textAlign:'center',
	// 	fontSize:'1.2rem',
	// 	fontWeight:'bold',
	// 	marginTop:'1rem',
	// 	marginBottom:'1rem',
	// 	wordSpacing:'0.2rem'
		
	// },
	// logoImage:{
		
	// 	margin:'auto',
	// 	display:'block'
	// },
	// roundedInputs:{
	// 	borderRadius:"5px"
	// },


});

export const Confirmationcode = (props) => {
	const cl = useStyles()
	const { classes } = props;
	return (
	
		<div>
			<Box display="flex" flexDirection="row" justifyContent="left">
				<Box p={1} className="headerLogo">
					<img src="/logowhite.png" className="logowhite" alignContent="center" alignItems="center" />
				</Box>
				<Box flexGrow={1} className="headerRest">

				</Box>
			</Box>
			<Box className="mainBox" display="flex" flexDirection="column" justifyContent="center">
				<Container component={Paper} maxWidth="xs" className={props.container} align="center">
					{props.error ? (
						<Alert severity="error">
							<AlertTitle>Error</AlertTitle>
							{props.error}
						</Alert>
					) : (
						''
						)}
					<Typography variant="h5" gutterBottom>
						Please enter the confirmation code we have send to your email address:
					</Typography>
					<TextField
						InputLabelProps={{
							shrink: true,

						}}
						autoFocus
						margin="dense"
						id="key"
						ref={props.codeRef}
						onChange={(e) => props.setConfirmationCode(e.target.value)}
						label="Confirmation Code"
						type="text"
						fullWidth
						labelWidth="100"
						variant="outlined"
						align="left"
					/>
					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="redButton width20"  onClick={props.handleConfirmCode}>
							Confirm
						</Button>
					</div>

					<div className="contentCenter marginBottom1">
						<Button fullWidth variant="contained" className="blackButton width20"  onClick={props.handleResendCode}>
							Resend
						</Button>
					</div>
				
				</Container>
			</Box>

		</div>
	);
}

export default withStyles(useStyles)(Confirmationcode)