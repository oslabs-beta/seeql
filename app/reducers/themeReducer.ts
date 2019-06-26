
export default function themeReducer(state, action) {
  
  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {
        if (mode['value'] === action.selected) mode = { value: mode['value'], active: true }
        if (mode['value'] !== action.selected)mode = {value: mode['value'], active: false}

   return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
 