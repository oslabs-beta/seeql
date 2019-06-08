import * as React from 'react';
import styled from 'styled-components';

const Table = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: black;
  font-family: 'Poppins', sans-serif;
`;

const InnerTableWrapper = styled.ul`
  border: 1px solid black;
  flex-direction: column;
  width: 300px;
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
    const primaryKey = primarykey === columns[keys]['columnname'] ? true : false;
    let affected = false;
    let foreignKey = false;
    let foreignkeyTable = 'none';
    let foreignkeyColumn = 'none';
  
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

    foreignkeys.forEach((key) => {
      if (key.column_name === columns[keys]['columnname']){
        foreignKey = true;
        foreignkeyTable = key.foreign_table_name;
        foreignkeyColumn = key.foreign_column_name;
      }
    })

    rows.push(<TableRow 
                key={generateUniqueKey()}
                onMouseEnter={displayRelationships}
                onMouseLeave={removeRelationships}
                affected={affected}
              ><TableCell
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
      <label>{tableName}</label>
      <InnerTableWrapper>
        {rows}
      </InnerTableWrapper>
    </Table>
  );
};

export default Tables;
