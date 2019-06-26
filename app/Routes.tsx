import * as React from 'react';

// I'm having an issue using react-router-dom with electron. In development, the
// router correctly functions and routes users between the different pages. In
// production, the router no longer functions correctly. In addition to the repo
// showing the issue, I have some gifs that can quickly outline the problem.
// Working in development, not working in production.

import { Switch, Route } from 'react-router';
const routes = require('./constants/routes.json');
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOMEPAGE} component={HomePage} />
      <Route path={routes.LOGIN} component={LoginPage} />
    </Switch>
  </App>
);
