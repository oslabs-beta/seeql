import * as types from '../constants/actionTypes';

//this object always takes state in the form of an object,and an action in the form of a string

export interface ActionObject {
  type: string;
  payload?: Partial<{}>;
}

type State = Partial<{}>;

/*
TODO: speciify reducer state properties. Function takes either a state object whos payload's value will be some object with unspecified properties

And return a string or an error object

*/

export default function changedisplayOfSidePanel(
  _state: State,
  action: ActionObject
): string | { new (): Error } {
  switch (action.type) {
    case types.CHANGE_TO_INFO_PANEL:
      return 'info';
    case types.CHANGE_TO_FAV_PANEL:
      return 'favorites';
    case types.CHANGE_TO_SETTINGS_PANEL:
      return 'settings';
    default:
      throw new Error();
  }
}
