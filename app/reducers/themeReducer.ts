
export default function themeReducer(state, action) {
  // console.log(
  //   'in reducer ',
  //   action.type,
  //   action.selected,
  //   action.payload,
  //   state
  // );
  // console.log ('payload', action.payload)
  //when you get the selected theme,
  //you want to update the payload, active value, update the type with the true active value and spread thte state
  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {
        console.log ('state', state)
        console.log ('mode', mode)
        // let setModeVal ='';
        if (mode['value'] === action.selected)
         { 
          console.log('same::', mode['value'], action.payload)

           mode = { value: mode['value'], active: true }
          //  setModeVal = action.selected
          }
        if (mode['value'] !== action.selected){
          mode = {value: mode['value'], active: false}
        }
        // if (mode.value === action.payload)
        //   console.log('diffferent::', mode.value, action.payload)
        //   {
        //     mode = { value: mode.value, active: false }
        //     setModeVal = mode.value
        // }
          // if (mode.currentMode){
          //   console.log ('cuttentMode' , mode.currentMode)
          //   mode.currentMode = setModeVal
          // }
   return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
 