import * as React from "react";
import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "../Routes";

export default class Root extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}
