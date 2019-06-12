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

const ListOfResults = styled.ul`
    padding: 10px 20px;
    overflow: scroll;
`

interface ITableName {
    name: string
}

interface Props {
    listOfTableNames: Array<ITableName>;
    searchInput: any;
    filteredTables: any;
}

const SearchPanel: React.SFC<Props> = ({ filteredTables, searchInput }) => {
    return(
        <LeftPanelTableListWrapper>
            <Title>Tables</Title>
            <SearchField type="text" placeholder="Search for a table" onChange={searchInput}></SearchField>
            {filteredTables.length>0 &&
             <ListOfResults>
              {filteredTables}
            </ListOfResults>
            }
            { !filteredTables.length &&
                <div>Sorry, no search results, please try again!!!!!!!!!!!</div>
            }
        </LeftPanelTableListWrapper>
    )
}

export default SearchPanel;