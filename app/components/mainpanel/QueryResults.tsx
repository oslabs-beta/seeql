import * as React from 'react';
import styled from 'styled-components';
// import ReactTable from 'react-table';
import { Grommet, Box, DataTable } from "grommet";
import { grommet } from "grommet/themes";

const QueryResultWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid black;
  overflow: scroll;
  height: 60vh;
`;

// const reactTableStyle = {
//   fontSize: '60%',
//   backgroundColor: 'transparent'
// };

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
            <Grommet theme={grommet}>
              <Box align="center" pad="medium">
                <DataTable sortable resizable 
                  columns={columns.map(c => ({
                    ...c,
                    search: true,
                  }))}
                  data={queryResult.message} step={10} />
              </Box>
            </Grommet>
            // <ReactTable
            //   style={reactTableStyle}
            //   data={queryResult.message}
            //   columns={columns}
            // />
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
