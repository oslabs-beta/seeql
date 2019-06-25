import * as React from 'react';
import styled from 'styled-components';
import { Box, DataTable } from "grommet";

const QueryResultWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
      border: 1px solid white;
    border-radius: 3px;
    box-shadow: 2px 2px 8px lightgrey;
  overflow: scroll;
  height: 60vh;
`;

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
            <div>{`There were no results found for your query :(`}</div>
          )
        }
        {
          queryResult.message.length === 0 &&
          queryResult.status === 'No query' && (
            <div>{`You haven't queried anything! Enter a query above to get started. :(`}</div>
          )
        }
      </Box >
    </QueryResultWrapper>
  );
};

export default QueryResults;
