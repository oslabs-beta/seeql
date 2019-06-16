import * as React from 'react';
import styled from 'styled-components';

interface ITableProps {
  selectedtable: string
  tablename: string
}

const Table = styled.div<ITableProps>`
  display: flex;
  flex-direction: column;
  background-color: white;
  font-size: 80%;
  width: 200px;
  border-radius: 3px;
  border: ${(props) => (props.selectedtable === props.tablename) ? '2px solid #00b5cc' : '1px solid grey'};
  box-shadow: ${(props) => (props.selectedtable === props.tablename) ? '4px 4px 10px  #99f3ff' : 'none'};
`;

const TableRowsList = styled.ul`
  flex-direction: column;
  max-height: 200px;
  overflow: scroll;
`;

interface ITableRowProps {
  affected: boolean
}

const TableRow = styled.li<ITableRowProps>`
  display: flex;
  justify-content: space-between;
  list-style: none;
  background-color: ${ ({affected}) => affected ? '#00b5cc' : 'transparent'};
  border: none;
  padding: 5px;
  transition: 0.3s;

  :hover {
    transform: scale(1.01);
    background-color: #e8ecf1;
  }
`;

const TableCell = styled.p`
  padding: 5px;
  font-size: 100%;
  display: flex;
  align-items: center;
`;

const TableTitle = styled.p`
  text-align: center;
  font-size: 140%;
  padding: 5px;
  overflow-wrap: break-word;
`
interface IForeignKey {
  column_name?: string
  constraint_name?: string
  foreign_column_name?: string
  foreign_table_name?: string
  foreign_table_schema?: string
  table_name?: string
  table_schema?: string
}

interface IPrimaryKeyAffected {
  primaryKeyColumn: string
  primaryKeyTable: string 
}

interface IForeignKeysAffected {
  column: string
  table: string
}

interface IColumnsMetaData {
  characterlength?: string
  columnname: string
  datatype: string
  defaultvalue: string
}

interface IActiveTableInPanel {
  columns?: Array<IColumnsMetaData>
  foreignKeys?: Array<IForeignKey>
  foreignKeysOfPrimary?: any
  primaryKey?: string
  table_name?: string
}

type Props = {
  key: string;
  tableName: string;
  columns: Array<string>;
  primarykey: string;
  foreignkeys: Array<IForeignKey>;
  primaryKeyAffected: Array<IPrimaryKeyAffected>;
  foreignKeysAffected: Array<IForeignKeysAffected>;
  activeTableInPanel: IActiveTableInPanel;
  captureMouseExit: () => void;
  captureMouseEnter: (Event) => void;
  captureSelectedTable: (Event) => void;
};

const KeyIcon = styled.img`
  width: 15px;
  height: 15px;
`

const Tables: React.SFC<Props> = ({ 
  tableName,
  columns, 
  primarykey,
  foreignkeys,
  foreignKeysAffected,
  primaryKeyAffected,
  captureMouseExit,
  captureMouseEnter,
  captureSelectedTable,
  activeTableInPanel
}) => {

  let rows = [];

  for (let keys in columns) {
    const primaryKey: boolean = (primarykey === columns[keys]['columnname']) ? true : false;
    let affected: boolean = false;
    let foreignKey: boolean = false;
    let foreignkeyTable: string = '';
    let foreignkeyColumn: string = '';
  
    if (
      primaryKeyAffected[0].primaryKeyColumn === columns[keys]['columnname'] &&
      primaryKeyAffected[0].primaryKeyTable === tableName
    ) affected = true;

    foreignKeysAffected.forEach((option):void => {
      if ( 
        option.table === tableName && 
        option.column === columns[keys]['columnname']
      ) affected = true;
    })

    foreignkeys.forEach((key):void => {
      if (key.column_name === columns[keys]['columnname']){
        foreignKey = true;
        foreignkeyTable = key.foreign_table_name;
        foreignkeyColumn = key.foreign_column_name;
      }
    })

    rows.push(<TableRow 
                key={columns[keys]['columnname']}
                onMouseOver={captureMouseEnter}
                onMouseLeave={captureMouseExit}
                affected={affected}
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}
              >
              <TableCell
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}
              >
               {foreignKey &&
                <KeyIcon 
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}  
                src="https://image.flaticon.com/icons/svg/891/891399.svg"></KeyIcon>
               } 
               {primaryKey &&
                <KeyIcon 
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}
                src="https://image.flaticon.com/icons/svg/179/179543.svg"></KeyIcon>
               } 
                <label
                 data-isforeignkey={foreignKey}
                 data-foreignkeytable={foreignkeyTable}
                 data-foreignkeycolumn={foreignkeyColumn}
                 data-tablename={tableName}
                 data-columnname={columns[keys]['columnname']}
                 data-isprimarykey={primaryKey}
                >{ columns[keys]['columnname']}</label>
              </TableCell>
              <TableCell
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}
              >{ columns[keys]['datatype']== 'character varying' ? 'varchar' :  columns[keys]['datatype'] }
              </TableCell>
             </TableRow>)
  }

  return (
    <Table key={tableName} onClick={captureSelectedTable} selectedtable={activeTableInPanel.table_name} tablename={tableName}>
      <TableTitle data-tablename={tableName}>{tableName}</TableTitle>
      <TableRowsList>
        {rows}
      </TableRowsList>
    </Table>
  );
};

export default Tables;
