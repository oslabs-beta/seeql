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

const Index = () => {
  const initialMode = { light: true, dark: false };
  const [context, setContext] = useState(initialMode);

  return (
    <ThemeContext.Provider value={[context, setContext]}>
      <ThemeProvider theme={context.light ? themes.default : themes.dark}>
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
