export default function themeReducer(state, action) {
  console.log(
    'in reducer ',
    action.type,
    action.selected,
    action.payload,
    state
  );
  //when you get the selected theme,
  //you want to update the payload, active value, update the type with the true active value and spread thte state
  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {
        //if the mode value in the array matches the theme selected, set the mode-active value in array equal to true
        if (mode.value === action.selected)
         { mode = { value: action.selected, active: true }}
        //if the mode value in the array matches the existing mode, AND  the existing mode does not equal the selected, set the mode-active value in array equal to false
        if (mode.value === action.payload)
          {mode = { value: mode.value, active: false }}
   return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
