import * as types from '../constants/actionTypes';

interface Action {
  type: string;
  payload: KeyProp;
}

interface KeyProp {
  tablename: string;
}

/*
- Function, changePinnedStatus take an array of values, and an action object with type and payload properties requires

- Payload should be an object with one property, tableName that corresponds to a string.

- changePinnedStatus returns either an array of strings or an error object if incorrect passed in value
*/

export default function changePinnedStatus(
  state: string[],
  action: Action
): string[] | { new (): Error } {
  console.log(state);
  const pinnedItems = state.slice();
  switch (action.type) {
    //will return an array of strings or an error object
    case types.REMOVE_FROM_PINNED:
      const newPinnedItems = state.filter(
        table => table !== action.payload.tablename
      );
      return newPinnedItems;
    case types.ADD_TO_PINNED:
      pinnedItems.push(action.payload.tablename);
      return pinnedItems;
    default:
      throw new Error();
  }
}
