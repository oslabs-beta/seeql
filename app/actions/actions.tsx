import * as actions from '../constants/actionTypes';

export const removeFromPinned = table_name => ({
    type: actions.REMOVE_FROM_PINNED,
    payload: {
      tablename: table_name
    }});

export const addToPinned = table_name => ({
    type: actions.ADD_TO_PINNED,
    payload: {
        tablename: table_name
    }});
