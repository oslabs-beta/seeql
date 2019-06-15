import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "./containers/Root";
import "./app.global.css";
import ThemeContext from "./contexts/themeContext";
import themes from "./themes/themes";

render(
  <ThemeContext.Provider value={themes}>
    <AppContainer>
      <Root />
    </AppContainer>
  </ThemeContext.Provider>,
  document.getElementById("root")
);

if ((module as any).hot) {
  (module as any).hot.accept("./containers/Root", () => {
    // eslint-disable-next-line global-require
    const NextRoot = require("./containers/Root").default;
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
