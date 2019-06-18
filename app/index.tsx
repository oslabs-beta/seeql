import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import "./app.global.css";
import ThemeContext from "./contexts/themeContext";
import themes from "./themes/themes";
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useState } from "react";
//memo to persist users active theme? for right now use default as user's first theme
const Index = () => {
  const initialMode = [{ value:'default', active: true },
   { value:'dark', active: false },
    { value: 'kate',active: false },
   { value:'ariel', active: false },
   {value:'tyler', active: false },
  {value:'alice', active: false }]
  ;
  const [context, setContext] = useState(initialMode);

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme ={themes}>
        <AppContainer>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AppContainer>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
render(<Index />, document.getElementById("root"));

// theme={context.light ? themes.default : themes.dark}