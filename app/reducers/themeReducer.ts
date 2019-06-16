// import * as types from "../constants/actionTypes";

// {{ modes: { light: true, dark: false } }}

export default function themeReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_LIGHT": {
      return {
        ...state,
        light: true,
        dark: false
      };
    }
    case "TOGGLE_DARK": {
      return {
        ...state,
        light: false,
        dark: true
      };
    }
    default: {
      return state;
    }
  }
}
