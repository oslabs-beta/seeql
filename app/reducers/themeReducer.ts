export default function themeReducer(state, action) {
  console.log('in reducer ', action.type, action.selected, action.payload, state);
  //when you get the selected theme,
  //you want to update the payload, active value, update the type with the true active value and spread thte state
  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {
        if (mode.value === action.selected.toLowerCase()) mode = { value: action.selected, active: true } 
        if (mode.value ===action.payload) mode = {value: action.payload, active:false}
        return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
