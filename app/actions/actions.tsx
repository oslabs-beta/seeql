import * as actions from '../constants/actionTypes';

interface TableName {
  tablename: string;
}

interface ActionObject {
  type: string;
  payload?: TableName;
}

//ts
export const removeFromPinned = (tableName: string): ActionObject => ({
  type: actions.REMOVE_FROM_PINNED,
  payload: {
    tablename: tableName
  }
});

export const addToPinned = (tableName: string): ActionObject => ({
  type: actions.ADD_TO_PINNED,
  payload: {
    tablename: tableName
  }
});

export const changeToInfoPanel = (): ActionObject => ({
  type: actions.CHANGE_TO_INFO_PANEL
});

export const changeToFavPanel = (): ActionObject => ({
  type: actions.CHANGE_TO_FAV_PANEL
});

export const changeToSettingsPanel = (): ActionObject => ({
  type: actions.CHANGE_TO_SETTINGS_PANEL
});
