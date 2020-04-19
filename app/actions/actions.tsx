import * as actions from '../constants/actionTypes';

//function should take a string and return an object

/*
export const removeFromPinned = table_name => ({
  type: actions.REMOVE_FROM_PINNED,
  payload: {
    tablename: table_name
  }
});
export const addToPinned = table_name => ({
    type: actions.ADD_TO_PINNED,
    payload: {
        tablename: table_name
    }});

export const changeToInfoPanel = () => ({
  type: actions.CHANGE_TO_INFO_PANEL
});


export const changeToFavPanel = () => ({
  type: actions.CHANGE_TO_FAV_PANEL
});

export const changeToSettingsPanel = () => ({
  type: actions.CHANGE_TO_SETTINGS_PANEL
});

*/

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
