import * as React from 'react';
import styled from 'styled-components';
import ReactTable from "react-table";

const QueryResultWrapper = styled.div`
    padding: 20px;
    width: 100%;
`
interface IQueryResultsProps {
    queryResult: Array<any>
}

const QueryResults: React.SFC<IQueryResultsProps> = ({queryResult}) => {
    let columns=[];

    if(queryResult.length > 0) {
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
            { queryResult.length > 0 &&
            <ReactTable 
                data={queryResult}
                columns={columns}
            />
            }
            { queryResult.length === 0 &&
            <div>You haven't queried anything.</div>
            }
        </QueryResultWrapper>
    )
}

export default QueryResults;