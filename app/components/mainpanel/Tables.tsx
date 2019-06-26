import * as React from 'react';
import styled from 'styled-components';
import { License, StatusGood } from 'grommet-icons';

interface ITableProps {
  selectedtable: string;
  tablename: string;
}

const Table = styled.div<ITableProps>`
  display: flex;
  flex-direction: column;
  font-size: 60%;
  border-radius: 3px;
  transition: 0.3s;
`;

const TableRowsList = styled.ul`
  overflow: scroll;
  height: 150px;
`;

interface ITableRowProps {
  affected: boolean;
  inTheQuery: boolean;
}

const TableRow = styled.li<ITableRowProps>`
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0px 3px;
  border: ${ (props) => props.affected ? '2px solid #F2B25E' : '2px solid transparent'};
  transition: 0.3s;
 background-color: ${ (props) => props.affected ? '#F2B25E' : 'transparent'};

  :hover {
    background-color: #f4f4f4;
    transform: scale(1.01);
    cursor: pointer;
  }
`;

const TableCell = styled.p`
  font-size: 100%;
  display: flex;
  align-items: center;
`;


interface IForeignKey {
  column_name?: string;
  constraint_name?: string;
  foreign_column_name?: string;
  foreign_table_name?: string;
  foreign_table_schema?: string;
  table_name?: string;
  table_schema?: string;
}

interface IPrimaryKeyAffected {
  primaryKeyColumn: string;
  primaryKeyTable: string;
}

interface IForeignKeysAffected {
  column: string;
  table: string;
}

interface IColumnsMetaData {
  characterlength?: string;
  columnname: string;
  datatype: string;
  defaultvalue: string;
}

interface IActiveTableInPanel {
  columns?: IColumnsMetaData[];
  foreignKeys?: IForeignKey[];
  foreignKeysOfPrimary?: any;
  primaryKey?: string;
  table_name?: string;
}

interface Props {
  key: string;
  tableName: string;
  columns: string[];
  primarykey: string;
  foreignkeys: IForeignKey[];
  primaryKeyAffected: IPrimaryKeyAffected[];
  foreignKeysAffected: IForeignKeysAffected[];
  activeTableInPanel: IActiveTableInPanel;
  selectedForQueryTables: any;
  captureMouseExit: () => void;
  captureMouseEnter: (Event) => void;
  captureQuerySelections: (Event) => void;
}


const Tables: React.SFC<Props> = ({
  tableName,
  columns,
  primarykey,
  foreignkeys,
  foreignKeysAffected,
  primaryKeyAffected,
  captureMouseExit,
  captureMouseEnter,
  activeTableInPanel,
  captureQuerySelections,
  selectedForQueryTables
}) => {
  const rows = [];

  for (const keys in columns) {
    const primaryKey: boolean = (primarykey === columns[keys]['columnname']);
    let affected = false;
    let foreignKey = false;
    let foreignkeyTable = '';
    let foreignkeyColumn = '';
    let inTheQuery = false;
    if (Object.keys(selectedForQueryTables).includes(tableName)) {
      if (
        selectedForQueryTables[tableName].columns.includes(
          columns[keys].columnname
        )
      )
        inTheQuery = true;
    }

    if (
      primaryKeyAffected[0].primaryKeyColumn === columns[keys].columnname &&
      primaryKeyAffected[0].primaryKeyTable === tableName
    )
      affected = true;

    foreignKeysAffected.forEach((option): void => {
      if (
        option.table === tableName &&
        option.column === columns[keys].columnname
      )
        affected = true;
    });

    foreignkeys.forEach((key): void => {
      if (key.column_name === columns[keys].columnname) {
        foreignKey = true;
        foreignkeyTable = key.foreign_table_name;
        foreignkeyColumn = key.foreign_column_name;
      }
    });

    rows.push(
      <TableRow
        key={columns[keys].columnname}
        onMouseOver={captureMouseEnter}
        onMouseLeave={captureMouseExit}
        onClick={captureQuerySelections}
        inTheQuery={inTheQuery}
        affected={affected}
        data-isforeignkey={foreignKey}
        data-foreignkeytable={foreignkeyTable}
        data-foreignkeycolumn={foreignkeyColumn}
        data-tablename={tableName}
        data-columnname={columns[keys].columnname}
        data-isprimarykey={primaryKey}
      >
        <TableCell
          data-isforeignkey={foreignKey}
          data-foreignkeytable={foreignkeyTable}
          data-foreignkeycolumn={foreignkeyColumn}
          data-tablename={tableName}
          data-columnname={columns[keys].columnname}
          data-isprimarykey={primaryKey}
        >
          {inTheQuery && (
            <StatusGood style={{ height: '15px' }} color="#2ecc71" />
          )}
          {foreignKey && (
            <License
              style={{ height: '15px' }}
              color="#6532CC"
              data-isforeignkey={foreignKey}
              data-foreignkeytable={foreignkeyTable}
              data-foreignkeycolumn={foreignkeyColumn}
              data-tablename={tableName}
              data-columnname={columns[keys].columnname}
              data-isprimarykey={primaryKey}
            />
          )}
          {primaryKey && (
            <License
              style={{ height: '15px' }}
              color="#28C3AA"
              data-isforeignkey={foreignKey}
              data-foreignkeytable={foreignkeyTable}
              data-foreignkeycolumn={foreignkeyColumn}
              data-tablename={tableName}
              data-columnname={columns[keys].columnname}
              data-isprimarykey={primaryKey}
            />
          )}
          {` ` + columns[keys]['columnname']}
        </TableCell>
        <TableCell
          data-isforeignkey={foreignKey}
          data-foreignkeytable={foreignkeyTable}
          data-foreignkeycolumn={foreignkeyColumn}
          data-tablename={tableName}
          data-columnname={columns[keys].columnname}
          data-isprimarykey={primaryKey}
        >
          {columns[keys].datatype === 'character varying'
            ? 'varchar'
            : columns[keys].datatype}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table
      key={tableName}
      selectedtable={activeTableInPanel.table_name}
      tablename={tableName}
    >
      <TableRowsList>{rows}</TableRowsList>
    </Table>
  );
};

export default Tables;
