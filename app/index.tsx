import * as React from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
// import { hot } from 'react-hot-loader/root';

import ThemeContext from './contexts/themeContext';
import themes from './themes/themes';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Switch, Route } from 'react-router';
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';

const Index = () => {
  const modes = [{ value: 'defaultTheme', active: true }, { value: 'darkTheme', active: false }]
  const [context, setContext] = useState(modes);
  const serveMode = context.reduce((acc, mode) => {
    if (mode.active) acc = mode.value;
    return acc;
  }, 'defaultTheme');

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme={themes[serveMode]}>
        <Switch>
          <Route path="/homepage" component={HomePage} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </ThemeProvider>
    </ThemeContext.Provider >
  );
};

// hot(Index);

render(<HashRouter><Index /></HashRouter>, document.getElementById('root'));
