import * as React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { License, StatusGood } from 'grommet-icons';

interface ITableProps {
  selectedtable: string;
  tablename: string;
}

const Table = styled.div<ITableProps>`
  display: flex;
  flex-direction: column;
  background-color: white;
  font-size: 70%;
  border-radius: 3px;
  transition: 0.3s;
`;

const TableRowsList = styled.ul`
  flex-direction: column;
  max-height: 200px;
  overflow: scroll;
`;

interface ITableRowProps {
  affected: boolean;
  inTheQuery: boolean;
}

const TableRow = styled.li<ITableRowProps>`
  display: flex;
  justify-content: space-between;
  list-style: none;
  border: ${ (props) => props.affected ? '2px solid #28C3AA' : '2px solid transparent'};
  padding: 5px;
  transition: 0.3s;

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

const TableTitle = styled.p`
  text-align: center;
  font-size: 140%;
  padding: 5px;
  overflow-wrap: break-word;
  cursor: pointer;
  background-color: #eeeeee;
  :hover {
    transform: scale(1.01);
    background-color: rgb(240, 240, 240);
  }
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
              color="#6DDEF4"
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
              color="#f39c12"
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
      <TableTitle onClick={() => ipcRenderer.send('query-to-main', `SELECT * FROM ${tableName}`)} data-tablename={tableName}>{tableName}</TableTitle>
      <TableRowsList>{rows}</TableRowsList>
    </Table>
  );
};

export default Tables;
