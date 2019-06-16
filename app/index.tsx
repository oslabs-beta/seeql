import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import "./app.global.css";
import ThemeContext from "./contexts/themeContext";
import themes from "./themes/themes";
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useContext, useState } from "react";

const initialMode = { light: true, dark: false };
//set state for a light theme and for a dark
//dispatch an action that updates the state
const Index = () => {
  const [modes, setModes] = useState(initialMode);
  const context = useContext(ThemeContext);

  console.log("MODES", modes);
  console.log("in index", context);
  return (
    <ThemeContext.Provider value={{ modes: initialMode, setModes }}>
      <ThemeProvider theme={themes}>
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

// if ((module as any).hot) {
//   (module as any).hot.accept("./containers/Root", () => {
//     // eslint-disable-next-line global-require
//     const NextRoot = require("./containers/Root").default;
//     render(
//       <AppContainer>
//         <NextRoot />
//       </AppContainer>,
//       document.getElementById("root")
//     );
//   });
// }
