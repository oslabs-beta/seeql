import { createContext } from 'react';

/* Partial constructs a type with all properties set to optional.

Partial<{}> becuase explicitly defined interfaces can not be empty. We are returning (using createContext()) an empty array (object) with no default values.

type Partial<T> = { [P in keyof T]?: T[P]; }

- Construct a type, T
- T will be an object 

- in keyof is an index type query operator that references all the "known" properties of an object. We can explicitly list out the properties that can be valid for the output object HOWEVER, in keyof allows us to automatically update what is required if new properties are added

- P in keyof T references all known properties of arrays
- ? these properties may or amy not appear on the object
- T[P] the values of these properties will be the equivalent of accessing the object T at the key P

*/

const ThemeContext: Partial<{}> = createContext([]);

export default ThemeContext;
