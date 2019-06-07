import * as React from 'react';

type MapDatabaseTypes = {
  string: string;
  integer: number;
  boolean: boolean;
  float: number;
  number: number;
  regexp: RegExp;
};

type MapDatabase<T extends Record<string, keyof MapDatabaseTypes>> = {
  [K in keyof T]: MapDatabaseTypes[T[K]]
};

function asSchema<T extends Record<string, keyof MapDatabaseTypes>>(t: T): T {
  return t;
}

const { Provider, Consumer } = React.createContext(null);
