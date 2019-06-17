export default function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LIGHT': {
      return {
        light: true,
        dark: false
      };
    }
    case 'TOGGLE_DARK': {
      return {
        light: false,
        dark: true
      };
    }
    default: {
      return state;
    }
  }
}
