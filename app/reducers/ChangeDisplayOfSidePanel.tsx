import * as types from '../constants/actionTypes';

export default function changedisplayOfSidePanel(state, action) {
  switch (action.type) {
    case types.CHANGE_TO_INFO_PANEL:
      return 'search';
    case types.CHANGE_TO_FAV_PANEL:
      return 'favorites';
    case types.CHANGE_TO_SETTINGS_PANEL:
      return 'settings';
    default:
      throw new Error();
  }
}
