import * as React from 'react';
import styled from 'styled-components';
import ReactTable from "react-table";

const QueryResultWrapper = styled.div`
    border: 1px solid black;
    padding: 20px;
    width: 100%;
`
interface IQueryResultsProps {
    queryResult: Array<any>
}


const QueryResults: React.SFC<IQueryResultsProps> = ({queryResult}) => {
    console.log('inside component', queryResult)
    const columnNames = Object.keys(queryResult[0]);

    const columns = columnNames.map((column) => { 
        return ({
        Header: column,
        accessor: column
        })
    });

    

    return(
        <QueryResultWrapper>
            <ReactTable 
                data={queryResult}
                columns={columns}
            />
        </QueryResultWrapper>
    )
}

export default QueryResults;