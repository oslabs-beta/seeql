// https://jvilk.com/MakeTypes/

export interface mock {
  name: string;
  columns: Columns;
  primaryKey: string;
  foreignKeys?: (ForeignKeysEntity | null)[] | null;
}
export interface Columns {
  id: string;
  name?: string | null;
  age?: string | null;
  address?: string | null;
  salary?: string | null;
  date?: string | null;
  customer_id?: string | null;
  amount?: string | null;
}
export interface ForeignKeysEntity {
  self: string;
  referenced_table: string;
  referenced_column: string;
}
