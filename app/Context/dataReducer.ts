import SET_TABLES from './types';
// import dbQuery from '../Database/dbMiddleware';

const setDataTables = (type, state) => {
  //   let newTables = [...state];
  return {
    ...state,
    tables: ['new tables??']
  };
};

export default (state, action) => {
  switch (action.type) {
    case SET_TABLES:
      return setDataTables(action.payload, state);
    default:
      return state;
  }
};
