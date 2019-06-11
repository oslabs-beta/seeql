import * as React from "react";
import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "../Routes";

interface Props {}

export default class Root extends Component<Props> {
  render() {
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}
