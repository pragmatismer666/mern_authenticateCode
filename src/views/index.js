import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Main extends Component {

  constructor(props) {
    super();
    this.state = {
      userRole: localStorage.getItem("role")
    };
  }

  render() {
    switch (this.state.userRole) {
      case 'admin':
        return <Redirect to="/admin" />
      case 'mainreseller':
        return <Redirect to="/mainreseller" />
      case 'reseller':
        return <Redirect to="/reseller" />
      default:
        return <Redirect to="/user/login" />
    }
  }
}
export default Main;
