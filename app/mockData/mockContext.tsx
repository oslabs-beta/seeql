import * as React from 'react';

// export interface intrinsicElements {
//   name?: string;
//   columns: Columns;
//   primaryKey: string;
//   foreignKeys?: (ForeignKeysEntity | null)[] | null;
// }
// export interface Columns {
//   id: string;
//   name?: string | null;
//   age?: string | null;
//   address?: string | null;
//   salary?: string | null;
//   date?: string | null;
//   customer_id?: string | null;
//   amount?: string | null;
// }
// export interface ForeignKeysEntity {
//   self: string;
//   referenced_table: string;
//   referenced_column: string;
// }

const dataCtxt = React.createContext(null);

export const DataContextProvider = dataCtxt.Provider;
export const DataContextConsumer = dataCtxt.Consumer;
