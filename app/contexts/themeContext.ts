import { createContext } from "react";

const ThemeContext = createContext({
  modes: { light: true, dark: false }
});

export default ThemeContext;
