import * as React from 'react';
import styled from 'styled-components';
import { DataTable } from 'grommet';

const QueryResultWrapper = styled.div`
  width: 100%;
  border-radius: 3px;
  overflow: scroll;
  height: 100%;
  padding: 10px 0px 0px 0px;
  overflow: scroll;
`;

const SQueryEmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120%;
  padding: 20px;
  text-align: center;
`;

const SResultsWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 120%;
  overflow: scroll;
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
      if (column === 'id')
        columns.unshift({
          property: column,
          header: column
        });
      else
        columns.push({
          property: column,
          header: column
        });
    });
  }

  return (
    <QueryResultWrapper>
      {queryResult.message.length > 0 && (
        <SResultsWrapper>
          <DataTable
            sortable
            resizable
            columns={columns.map(c => ({
              ...c,
              search: true
            }))}
            data={queryResult.message}
            step={20}
          />
        </SResultsWrapper>
      )}
      {queryResult.message.length === 0 && queryResult.status === 'No results' && (
        <SQueryEmptyState>
          <div>
            {`There were no results found for your query.`}
            <br /> {`Please enter a new query.`}
          </div>
        </SQueryEmptyState>
      )}
      {queryResult.message.length === 0 && queryResult.status === 'No query' && (
        <SQueryEmptyState>
          <div>
            {`You haven't queried anything!`}
            <br /> {` Enter a query above to get started.`}
          </div>
        </SQueryEmptyState>
      )}
    </QueryResultWrapper>
  );
};

export default QueryResults;
