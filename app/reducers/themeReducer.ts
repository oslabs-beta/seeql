
/*
- themeReducer takes state in the form of an array
- each element in the array is an object, each object has two properties, value (string) and active (boolean)

- action is an object:
{
        type: 'CHANGE_MODE', |string
        selected: selectedMode, |string
        payload: activeMode |string
      }

-returns an array of objects with the same mapping as the current state

*/

interface ModeObj{
  value:string;
  active: boolean;
}
//state passed in will be an array of object dfined by the interface ModeObj
type State = ModeObj[]

//each action object will have the following predefined properties
interface Action{
  type:string;
  selected:string;
  payload: string;
}


export default function themeReducer(state:State, action:Action): State {

  switch (action.type) {
    case 'CHANGE_MODE': {
      const newState = state.map(mode => {
        if (mode['value'] === action.selected) mode = { value: mode['value'], active: true }
        if (mode['value'] !== action.selected) mode = { value: mode['value'], active: false }

        return mode;
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
