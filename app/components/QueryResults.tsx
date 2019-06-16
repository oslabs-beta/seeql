import * as React from 'react';
import styled from 'styled-components';
import ReactTable from "react-table";

const QueryResultWrapper = styled.div`
    padding: 20px;
    width: 100%;
`

interface IQueryResult{
    status: string
    message: Array<any>
}

interface IQueryResultsProps {
    queryResult: IQueryResult
}

const QueryResults: React.SFC<IQueryResultsProps> = ({queryResult}) => {
    console.log('query result ', queryResult)
    let columns=[];

    if(queryResult.message.length > 0) {
        const columnNames = Object.keys(queryResult[0]);
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
                data={queryResult}
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