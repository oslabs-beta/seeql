import * as actions from '../constants/actionTypes';

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
