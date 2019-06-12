import * as React from 'react';
import styled from 'styled-components';

const LeftPanelTableListWrapper = styled.div`
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 5px;
  border: 1px solid black;
  width: 300px;
  height: 100vh;
`

const Title = styled.h1`
  color: black;
`

const SearchField = styled.input`
  margin: 10px 20px;
  height: 20px;
  font-family: 'Poppins', sans-serif;
  border: none;
  border-bottom: 1px solid lightgrey;
  padding: 5px;
  :focus{
    outline: none;
  }
`

interface Props {
    searchInput: any;
}

const SearchPanel: React.SFC<Props> = ({ searchInput }) => {
    return(
        <LeftPanelTableListWrapper>
            <Title>
              Tables
            </Title>

            <SearchField 
            type="text" 
            placeholder="Search for a table" onChange={searchInput}></SearchField>
            
        </LeftPanelTableListWrapper>
    )
}

export default SearchPanel;