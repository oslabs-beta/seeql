import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './app.global.css';
import ThemeContext from './contexts/themeContext';
import themes from './themes/themes';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';
//memo to persist users active theme? for right now use default as user's first theme
const Index = () => {

  const modes = [
    { value: 'defaultTheme', active: true },
    { value: 'darkTheme', active: false },
    { value: 'kateTheme', active: false },
    { value: 'vaderette', active: false },
    { value: 'tylerTheme', active: false },
    { value: 'happi', active: false }
  ];
  const [context, setContext] = useState(modes);
  const serveMode = context.reduce((acc, mode) => {
      if (mode.active) acc = mode.value;
      return acc;
    }, 'defaultTheme');

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme={themes[serveMode]}>
        <AppContainer>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AppContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
render(<Index />, document.getElementById('root'));


