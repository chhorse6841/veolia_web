import React from "react";
import Box from "@material-ui/core/Box";
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { withTranslation } from 'react-i18next';


import {
   
    Link, withRouter
  } from "react-router-dom";
  import { withStyles } from '@material-ui/core/styles';
import { BorderColor } from "@material-ui/icons";

  const useStyles = (theme) => ({
	box: {
        height:'100vh',
        width:'100%',
        position:'fixed',
        backgroundImage:`url(${"/background1.png"})`,
        backgroundSize:'cover'

    },
    paper:{
        marginTop:'20rem',
        background:'transparent',
        width:'60%',
        height: '30%',
        backgroundColor:'#f3c3be9e',
        color:'#242524',
        border:'1px solid'
        
    },
    button:{
        marginTop:'2rem',
        border:'1px solid',
        fontWeight:'bold',
        color:'#ffffff',
        background:'black',
        '&:hover': {
            backgroundColor: '#ffffff',
            color:'red'
          },

    },
    
	
});



class Landing extends React.Component{
    constructor(props){
super(props)
    }

    render(){
        const {classes,t} = this.props;
        return (
            <Box className={classes.box} display="flex" flexDirection="column" alignContent="center" alignItems="center">
                <Paper elevation={3} className={classes.paper} alignContent="center" alignItems="center">
                    
                    <center style = {{marginTop: '25px'}}><h3>{t('Welcome')} {t('to the online platform of OTM-Zenith.')}</h3><h3>{t('We are Market Leader for decoration of machines, vehicles and buildings.')}</h3> <h4>{t('Please sign in via the button below')}</h4></center>

                    <Grid container spacing={3} justifyContent="center">
                        <Button variant="outlined" onClick={()=>this.props.history.push('/signin')} align="left" size="large" className={classes.button}>
                            {t('Sign In')}
                        </Button>
                    </Grid>
                    
                </Paper>
                 
             </Box>
        )
    }
}

const LandingWithTranslation = withTranslation()(Landing)
export default withRouter(withStyles(useStyles)(LandingWithTranslation));