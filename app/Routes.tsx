import * as React from 'react';
import { Switch, Route } from 'react-router';
const routes = require('./constants/routes.json');
import App from './containers/App';
import LoginPage from './containers/LoginPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.LOGIN} component={LoginPage} />
    </Switch>
  </App>
);
