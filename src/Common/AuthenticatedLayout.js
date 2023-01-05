import React from "react";
import { Button, Select, MenuItem } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";

import * as AuthenticationActions from "../actions/AuthenticationActions";
import { bindActionCreators } from "redux";
import { Progress } from "../Authentication/Progress";

import { withTranslation } from "react-i18next";

import Box from "@material-ui/core/Box";

const useStyles = (theme) => ({
  container: {
    marginTop: "0rem",
    padding: "2rem",
    gridGap: theme.spacing(1),
    backgroundColor: "#696764",
    color: "white",
  },
  button: {
    border: "1px solid",

    color: "#ffffff",
    borderRadius: "1rem",
  },
  profiletext: {
    fontWeight: "bolder",
    fontSize: "1.8rem",
    textAlign: "right",
  },
});

const mapStateToProps = (store) => {
  return { authentication: store.authentication };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AuthenticationActions, dispatch);
};

class AuthenticatedLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, loading: 1 };
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((data) => {
        this.setState({ ...this.state, loading: 0 });
        this.props.storeUser(data);
      })
      .catch((err) => this.props.history.push("/signin"));
  }

  handleLogout = async () => {
    //      e.target.preventDefault();
    try {
      this.setState({ ...this.state, loading: 1, error: "" });
      await Auth.signOut();
      this.props.removeUser();
      this.setState({ ...this.state, loading: 0 });
      this.props.history.push("/signin");
    } catch (err) {
      this.setState({ ...this.state, loading: 0 });
      this.setState({ ...this.state, error: err.message });
    }
  };

  render() {
    const { classes, t } = this.props;
    const { username } = this.props.authentication.user ?? "";
    let customName = "";
    let customer = "";
    let isAdmin = "";
    let language = this.props.i18n.language;
    let children = "";
    const baseProps = { i18n: this.props.i18n, t: this.props.t };
    if (this.props.authentication && this.props.authentication.user) {
      if (this.props.authentication.user.attributes) {
        if ("custom:name" in this.props.authentication.user.attributes) {
          customName = this.props.authentication.user?.attributes[
            "custom:name"
          ];
        }
        if ("custom:language" in this.props.authentication.user.attributes) {
          language = this.props.authentication.user?.attributes[
            "custom:language"
          ];
          switch (language) {
            case "1":
              language = "en";
              break;

            case "2":
              language = "fr";
              break;

            case "3":
              language = "nl";
              break;

            default:
              language = "en";
              break;
          }
        }
        if ("custom:customers" in this.props.authentication.user.attributes) {
          customer = this.props.authentication.user?.attributes[
            "custom:customers"
          ];
          isAdmin = this.props.authentication.user?.attributes[
            "custom:isAdmin"
          ];
          children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
              ...baseProps,
              customer: isAdmin === "1" ? "OTM" : customer,
              customName: customName,
              isAdmin,
              language,
            });
          });

          //this.setState({...this.state,customer})
        }

        if ("custom:isAdmin" in this.props.authentication.user.attributes) {
          customer = this.props.authentication.user?.attributes[
            "custom:customers"
          ];
          isAdmin = this.props.authentication.user?.attributes[
            "custom:isAdmin"
          ];
          console.log(customer);
          children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
              ...baseProps,
              customer: isAdmin === "1" ? "OTM" : customer,
              customName: customName,
              isAdmin,
              language,
            });
          });
          //this.setState({...this.state,customer})
        }
      }
    }
    if (this.state.loading)
      return <Progress container={classes.container}></Progress>;
    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="left">
          <Box p={1} className="headerLogo">
            <img
              alt="Logo"
              src="/logowhite.png"
              className="logowhite"
              style={{alignContent:"center", alignItems:"center"}}
            />
          </Box>
          <Box p={1} className="headerRest"></Box>
          <Box
            flexGrow={1}
            className="headerRest"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box flexGrow={1}>OTM-Zenith Fleet Decoration</Box>
            <Box flexGrow={2}>
              {t(`Welcome`)} <b>{customName ?? username}</b>
            </Box>
            <Box flexDirection="row" justifyContent="right">
              {isAdmin==1?(

            <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={()=>{this.props.history.push("/admin")}}
              >
                {t(`Admin`)}
              </Button>
              ):''}
              &nbsp;
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={this.handleLogout}
              >
                {t(`Logout`)}
              </Button>
              &nbsp;
              <Select
                id="langselect"
                displayEmpty={false}
                value={this.props.i18n.language}
                onChange={(e) => this.props.i18n.changeLanguage(e.target.value)}
                className={classes.languageDropdown}
                varient="standard"
                style={{alignSelf:"right"}}
              >
                <MenuItem selected>{t(`Language`)}</MenuItem>
                <MenuItem value="en">
                  &nbsp;
                  <img
                    src="/en.png"
                    className="langflags"
                    alt="/en.png"
                    style={{alignContent:"left", alignItems:"left"}}
                  />
                  &nbsp; EN &nbsp;
                </MenuItem>
                <MenuItem value="fr">
                  &nbsp;
                  <img
                    src="/france.jpg"
                    className="langflags"
                    alt="/france.png"
                    style={{alignContent:"left", alignItems:"left"}}
                  />
                  &nbsp; FR &nbsp;
                </MenuItem>
                <MenuItem value="nl">
                  &nbsp;
                  <img
                    src="/nl.png"
                    className="langflags"
                    alt="/nl.png"
                    style={{alignContent:"left", alignItems:"left"}}
                  />
                  &nbsp; NL &nbsp;
                </MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
        {/* <Container maxWidth="xl" className={classes.container} component={Paper} align="right" >

					<Grid container spacing={1}>
					<Grid item xs={10} align="right">
							
							<span className={classes.profiletext} >
								{t(`Welcome`)} {customName??username}
								</span>
						</Grid>
						<Grid item xs={2} align="left">
							<Button variant="outlined" className={classes.button} onClick={this.handleLogout}>
								{t(`Logout`)}
							</Button>
						</Grid>
					</Grid>
				</Container> */}

        {children !== "" ? children : ""}
      </>
    );
  }
}

const authenticationWithTranslation = withTranslation()(AuthenticatedLayout);
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(authenticationWithTranslation);
export default withRouter(withStyles(useStyles)(connected));
