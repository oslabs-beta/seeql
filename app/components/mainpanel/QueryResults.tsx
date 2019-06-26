import * as React from 'react';
import styled from 'styled-components';
import { Box, DataTable } from "grommet";

const QueryResultWrapper = styled.div`
      width: 100%;
    border-radius: 3px;
  overflow: scroll;
  height: 100%;
`;

const SQueryEmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120%;

`

interface IQueryResult {
  status: string;
  message: any[];
}

interface IQueryResultsProps {
  queryResult: IQueryResult;
}

const QueryResults: React.SFC<IQueryResultsProps> = ({ queryResult }) => {
  const columns = [];

  if (queryResult.message.length > 0) {
    const columnNames = Object.keys(queryResult.message[0]);
    columnNames.forEach(column => {
      if (column === 'id') columns.unshift({
        property: column,
        header: column,
      })
      else columns.push({
        property: column,
        header: column,
      });
    });
  }

  return (
    <QueryResultWrapper>
      <Box border overflow="scroll">
        {
          queryResult.message.length > 0 && (
            <Box align="center" pad="medium">
              <DataTable sortable resizable
                columns={columns.map(c => ({
                  ...c,
                  search: true,
                }))}
                data={queryResult.message} step={20} />
            </Box>
          )
        }
        {
          queryResult.message.length === 0 &&
          queryResult.status === 'No results' && (
            <SQueryEmptyState><span>{`There were no results found for your query. Please enter a new query.(`}</span></SQueryEmptyState>
          )
        }
        {
          queryResult.message.length === 0 &&
          queryResult.status === 'No query' && (
            <SQueryEmptyState><span>{`You haven't queried anything! Enter a query above to get started.`}</span></SQueryEmptyState>
          )
        }
      </Box >
    </QueryResultWrapper>
  );
};

export default QueryResults;
