import * as React from 'react';
import { render } from 'react-dom';
import './app.global.css';
import ThemeContext from './contexts/themeContext';
import themes from './themes/themes';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import { hot } from 'react-hot-loader/root';

const Index = () => {
  const initialMode = { light: true, dark: false };
  const [context, setContext] = useState(initialMode);

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme={context.light ? themes.default : themes.dark}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

hot(Index);

render(<Index />, document.getElementById('root'));
