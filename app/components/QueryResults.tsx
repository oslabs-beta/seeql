import * as React from 'react';
import styled from 'styled-components';
import ReactTable from "react-table";

const QueryResultWrapper = styled.div`
  padding: 20px;
  display: flex; 
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid black;
  overflow: scroll;
  width: 60vw;
  height: 60vh;
`

interface IQueryResult{
    status: string
    message: Array<any>
}

interface IQueryResultsProps {
    queryResult: IQueryResult
}

const QueryResults: React.SFC<IQueryResultsProps> = ({queryResult}) => {
    let columns=[];

    if(queryResult.message.length > 0) {
        const columnNames = Object.keys(queryResult.message[0]);
        columns = columnNames.map((column) => { 
            return ({
            Header: column,
            accessor: column
            })
        });
   }

    return(
        <QueryResultWrapper>
            { queryResult.message.length > 0 &&
            <ReactTable 
                data={queryResult.message}
                columns={columns}
            />
            }
            { ((queryResult.message.length === 0) && (queryResult.status === 'No results'))  &&
            <div>{`There were no results found for your query :(`}</div>
            }
            { ((queryResult.message.length === 0) && (queryResult.status === 'No query'))  &&
            <div>{`You haven't queried anything! Enter a query above to get started. :(`}</div>
            }
        </QueryResultWrapper>
    )
}

export default QueryResults;