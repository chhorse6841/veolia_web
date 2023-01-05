import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator } from "aws-amplify-react";
import Admin from "./admin/Admin";
import AuthenticationLayout from "./Common/AuthenticatedLayout";

import { useState, useEffect } from "react";

class App extends React.Component {
  constructor() {
    super();
    //this.state = {...this.state,['authState']:'signUp'};
    console.log(this.state);
  }
  componentDidMount() {
    //this.setState({...this.state,'authState':'signUp'})
    console.log(this.state);
  }

  componentWillMount() {
    console.log(this.state);
  }

  render() {
    return (
      <div className="App">
        <AuthenticationLayout>
          <Admin></Admin>
        </AuthenticationLayout>
      </div>
    );
  }
}

export default App;
