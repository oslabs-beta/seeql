import * as React from 'react';
import styled from 'styled-components';

const Table = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: black;
  font-family: 'Poppins', sans-serif;
  box-shadow: 1px 2px 5px lightgrey;
  height: 100px;
`;

const InnerTableWrapper = styled.ul`
  border: 1px solid black;
  flex-direction: column;
  overflow: scroll;
`;

const TableRow = styled.li`
  display: flex;
  justify-content: space-between;
  list-style: none;
  background-color: ${ ({affected}) => affected ? 'pink' : 'transparent'};
  border: ${ ({affected}) => affected ? '3px solid pink' : '3px solid transparent'};
  border-top: 1px solid lightgrey;
  transition: 0.3s;

`;

const TableCell = styled.p`
  padding: 0px 20px;
  font-size: 12px;
`;

const TableTitle = styled.label`
  background: #456990;
  padding: 5px;
  color: white;
  font-weight: bold;
`

type Props = {
  key: string;
  tableName: string;
  columns: Array<string>;
  primarykey: string;
  foreignkeys: Array<any>;
  primaryKeyAffected: Array<any>;
  foreignKeysAffected: Array<any>;
  removeRelationships: () => void;
  displayRelationships: (Event) => void;
};

const Tables: React.SFC<Props> = ({ 
  tableName,
  columns, 
  primarykey,
  foreignkeys,
  foreignKeysAffected,
  primaryKeyAffected,
  displayRelationships,
  removeRelationships
}) => {

  let rows = [];

  //acquires individual column names and corresponding types from data
  const generateUniqueKey = () => (Math.random() * 1000).toString();

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
                key={generateUniqueKey()}
                onMouseOver={displayRelationships}
                onMouseLeave={removeRelationships}
                affected={affected}
              >
              <TableCell
                data-isforeignkey={foreignKey}
                data-foreignkeytable={foreignkeyTable}
                data-foreignkeycolumn={foreignkeyColumn}
                data-isprimarykey={primaryKey}
                data-tablename={tableName}
                data-columnname={columns[keys]['columnname']}
              >{ columns[keys]['columnname'] }
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
    <Table key={generateUniqueKey()}>
      <TableTitle>{tableName}</TableTitle>
      <InnerTableWrapper>
        {rows}
      </InnerTableWrapper>
    </Table>
  );
};

export default Tables;
