
export default function themeReducer(state, action) {

  //when you get the selected theme,
  //you want to update the payload, active value, update the type with the true active value and spread thte state
  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {

        let setModeVal = '';
        if (mode.value === action.selected) {
          mode = { value: action.selected, active: true }
          setModeVal = action.selected
        }
        if (mode.value === action.payload) {
          mode = { value: mode.value, active: false }
          setModeVal = mode.value
        }
        if (mode.currentMode) {
          mode.currentMode = setModeVal
        }
        return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
