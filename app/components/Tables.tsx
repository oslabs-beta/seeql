import * as React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.ul`
  color: black;
  display: grid;
  grid-gap: 20px 20px;
  grid-auto-rows: auto;
  grid-auto-columns: minmax(100px, auto);
`;

const DivWrapper = styled.div`
  display: flex;
  border: 1px solid black;
  flex-direction: row;
  margin: auto;
`;

type Props = {
  key: string;
  tableName: string;
  columns: Array<string>;
};

const Tables: React.SFC<Props> = props => {
  let columns = [];
  let types = [];
  //acquires individual column names and corresponding types from data
  for (let keys in props.columns) {
    columns.push(<li>{props.columns[keys]['columnname']}</li>);
    types.push(<li>{props.columns[keys]['datatype']} </li>);
  }
  const generateUniqueKey = () => (Math.random() * 1000).toString();

  return (
    <TableWrapper key={generateUniqueKey()}>
      <label>{props.tableName}</label>
      <DivWrapper className="columns">
        <li className="columns">{columns}</li>
        <li className="types">{types}</li>
      </DivWrapper>
    </TableWrapper>
  );
};

export default Tables;
