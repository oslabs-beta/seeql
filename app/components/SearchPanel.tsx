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

const Text = styled.p`
  font-size: 15px;
`

const Label = styled.label`
  font-size: 10px;
`

interface ISelectedTable {
  columns?: Array<any>
  foreignKeys?: Array<any>
  primaryKey?: string
  table_name?: string
}

interface Props {
    searchInput: any
    activeTableInPanel: ISelectedTable
    onlyPinned: Array<any>
    removeFromPinned:(Event) => void
    addToPinned:(Event) => void
}

const SearchPanel: React.SFC<Props> = ({ searchInput, activeTableInPanel, onlyPinned, removeFromPinned,
  addToPinned }) => {
    const { table_name, primaryKey, foreignKeys } = activeTableInPanel;
    const foreignKeyRelationships = [];
    if(foreignKeys){
      foreignKeys.forEach((key) => {
        console.log('onlye pinned ', onlyPinned, key.foreign_table_name)
        if(onlyPinned.includes(key.foreign_table_name)){
        foreignKeyRelationships.push(
          <li><Text>{key.column_name} <Label as="span">from table</Label> {key.foreign_table_name}({key.foreign_column_name})</Text><button data-pinned={key.foreign_table_name} onClick={removeFromPinned}>UNPIN TABLE</button></li>
        )
        } else {
          foreignKeyRelationships.push(
            <li><Text>{key.column_name} <Label as="span">from table</Label> {key.foreign_table_name}({key.foreign_column_name})</Text><button data-pinned={key.foreign_table_name} onClick={addToPinned}>PIN TABLE</button></li>)
        }
      })
    }

    return(
        <LeftPanelTableListWrapper>
            <Title>
              Information 
            </Title>

            <SearchField 
            type="text" 
            placeholder="Search for a table" onChange={searchInput}></SearchField>
            {Object.keys(activeTableInPanel).length > 0 ?
            <div>
              <Label>table name</Label>
              <Text>{table_name}</Text>
              <Label>primary key</Label>
              <Text>{primaryKey}</Text>
              {foreignKeyRelationships.length ===0 &&
                <Label>This table does not have any foreign keys</Label>
              }
              {foreignKeyRelationships.length > 0 &&
              <div>
              <Label>foreign keys in this table are</Label>
              <ul>
                {foreignKeyRelationships}
              </ul>
              </div>}
            </div> 
            :
            <div>
              You haven't selected a table yet, click on a table to see their information
            </div>
            }
        </LeftPanelTableListWrapper>
    )
}

export default SearchPanel;