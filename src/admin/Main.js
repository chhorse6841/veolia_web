import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import UserGrid from "./UserGrid";
import Grid from "@material-ui/core/Grid";
import AddUser from "./AddUser";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
import Button from "@material-ui/core/Button";

const useStyles = (theme) => ({
  container: {
    maxWidth: 1200,
    margin: "auto",
    marginTop: "5rem",
  },
  floatRight: {
    float: "right",
  },
  marginRight: {
    marginRight: "1rem",
  },
});
class Main extends React.Component {
  constructor(props) {
    super();
  }
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const { classes } = this.props;
    const { users, loading } = this.props;
    const handleClose = () => {
      this.props.setSuccess(false);
    };

    if (loading) return <Container>...loading</Container>;
    return (
      <Container maxWidth="xl" className={classes.container}>
        {this.props.success ? (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              {this.props.success}
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}

        <Grid item xl={3} align="left">
          <AddUser {...this.props} marginRight={classes.marginRight} />
        </Grid>

        <UserGrid {...this.props}></UserGrid>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Main);
