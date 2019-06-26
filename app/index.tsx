import * as React from 'react';
import { render } from 'react-dom';
// import { hot } from 'react-hot-loader/root';
import './app.global.css';
import ThemeContext from './contexts/themeContext';
import themes from './themes/themes';
import { ThemeProvider } from 'styled-components';
import { useState, useEffect } from 'react';
import LoginPage from './containers/LoginPage';
import HomePage from './containers/HomePage';

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

  const [tableData, setTableData] = useState([]);
  const [currentView, setCurrentView] = useState('loginPage')

  useEffect(() => {
    if (tableData.length > 5) setCurrentView('homePage')
  }, [])

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme={themes[serveMode]}>
        <React.Fragment>
          {currentView === 'loginPage' &&
            <LoginPage
            setCurrentView={setCurrentView}
            setTableData={setTableData} />
          }
          {currentView === 'homePage' &&
            <HomePage setCurrentView={setCurrentView} tableData={tableData} />
          }
        </React.Fragment>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// hot(Index);

render(<Index />, document.getElementById('root'));
