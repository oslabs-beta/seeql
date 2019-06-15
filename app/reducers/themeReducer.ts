import * as types from "../constants/actionTypes";
import lightTheme from "../themes/themes";

export default function themeReducer(action, state) {
  switch (action.type) {
    case types.TOGGLE_LIGHT: {
      return [...state, lightTheme];
    }
    default: {
      return state;
    }
  }
}
