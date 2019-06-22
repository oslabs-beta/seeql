import * as React from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import './app.global.css';
import ThemeContext from './contexts/themeContext';
import Routes from './Routes';
import themes from './themes/themes';

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
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

hot(Index);

render(<Index />, document.getElementById('root'));
