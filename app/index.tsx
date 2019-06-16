import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import "./app.global.css";
import ThemeContext from "./contexts/themeContext";
import themes from "./themes/themes";
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
// import { useContext } from "react";

const initialMode = { light: true, dark: false };
//set state for a light theme and for a dark
//dispatch an action that updates the state
const Index = () => {
  // const context = useContext(ThemeContext);

  // console.log("INDEX FILE CONtext", context);
  return (
    <ThemeContext.Provider value={{ modes: initialMode }}>
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
