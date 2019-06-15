import * as React from 'react';
import styled from 'styled-components';

const QueryResultWrapper = styled.div`
    border: 1px solid black;
    padding: 20px;
`

const QueryResults = () => {
    return(
        <QueryResultWrapper>
            Query results!
        </QueryResultWrapper>
    )
}

export default QueryResults;