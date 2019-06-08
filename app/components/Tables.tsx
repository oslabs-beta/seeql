import * as React from 'react';
import styled from 'styled-components';

const Table = styled.div`
  color: black;
  display: grid;
  grid-gap: 20px 20px;
  grid-auto-rows: auto;
  grid-auto-columns: minmax(100px, auto);
`;

const InnerTableWrapper = styled.ul`
  display: flex;
  border: 1px solid black;
  flex-direction: column;
  margin: auto;
`;

const TableRow = styled.li`
  display: flex;
  justify-content: space-between;
  list-style: none;
`;

const TableCell = styled.p`
  padding: 0px 20px;
`;

type Props = {
  key: string;
  tableName: string;
  columns: Array<string>;
};

const Tables: React.SFC<Props> = props => {
  let rows = [];
  //acquires individual column names and corresponding types from data
  const generateUniqueKey = () => (Math.random() * 1000).toString();
  for (let keys in props.columns) {
    rows.push(<TableRow key={generateUniqueKey()}><TableCell>{props.columns[keys]['columnname']}</TableCell><TableCell>{props.columns[keys]['datatype']}</TableCell></TableRow>)
  }

  return (
    <Table key={generateUniqueKey()}>
      <label>{props.tableName}</label>
      <InnerTableWrapper>
        {rows}
      </InnerTableWrapper>
    </Table>
  );
};

export default Tables;
