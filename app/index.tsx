import * as React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader/root';
import './app.global.css';
import ThemeContext from './contexts/themeContext';
import themes from './themes/themes';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';

const Index = () => {
  const modes = [
    { value: 'defaultTheme', active: true },
    { value: 'darkTheme', active: false },
  ]


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
