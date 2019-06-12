import * as React from 'react';
import styled from 'styled-components';

const Table = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: black;
  font-family: 'Poppins', sans-serif;
  box-shadow: 1px 2px 5px lightgrey;

`;

const InnerTableWrapper = styled.ul`
  flex-direction: column;
  overflow: scroll;
`;

interface T {
  affected: boolean
}

const TableRow = styled.li<T>`
  display: flex;
  justify-content: space-between;
  list-style: none;
  background-color: ${ ({affected}) => affected ? 'mediumseagreen' : 'transparent'};
  border: none;
  border-top: 1px solid lightgrey;
  padding: 5px;
  margin: 0px 15px;
  transition: 0.3s;

  :hover {
    transform: scale(1.05);
    background-color: #e8ecf1;
  }
`;

const TableCell = styled.p`
  padding: 0px 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const TableTitle = styled.label`
  text-align: center;
  font-size: 20px;
  padding: 5px 0px;
`

type Props = {
  key: string;
  tableName: string;
  columns: Array<string>;
  primarykey: string;
  foreignkeys: Array<any>;
  primaryKeyAffected: Array<any>;
  foreignKeysAffected: Array<any>;
  captureMouseExit: () => void;
  captureMouseEnter: (Event) => void;
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
  captureMouseEnter
}) => {

  let rows = [];

  for (let keys in columns) {
    const primaryKey: boolean = primarykey === columns[keys]['columnname'] ? true : false;
    let affected: boolean = false;
    let foreignKey: boolean = false;
    let foreignkeyTable: string = '';
    let foreignkeyColumn: string = '';
  
    if (
      primaryKeyAffected[0].primaryKeyColumn === columns[keys]['columnname'] &&
      primaryKeyAffected[0].primaryKeyTable === tableName
    ) affected=true;

    foreignKeysAffected.forEach((option) => {
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
                >{ columns[keys]['columnname'] }</label>
              </TableCell>
              <TableCell
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
                data-isprimarykey={primaryKey}
              >{ columns[keys]['datatype'] }
              </TableCell>
             </TableRow>)
  }

  return (
    <Table key={tableName}>
      <TableTitle>{tableName}</TableTitle>
      <InnerTableWrapper>
        {rows}
      </InnerTableWrapper>
    </Table>
  );
};

export default Tables;
