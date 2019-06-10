import * as React from "react";
import { Switch, Route } from "react-router";
const routes = require("./constants/routes.json");
import App from "./containers/App";
import LoginPage from "./containers/LoginPage";
import HomePage from "./containers/HomePage";

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOMEPAGE} component={HomePage} />
      <Route path={routes.LOGIN} component={LoginPage} />
    </Switch>
  </App>
);
