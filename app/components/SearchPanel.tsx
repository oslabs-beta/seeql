import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";

const LeftPanelTableListWrapper = styled.div`
  color: black;
  font-family: "Poppins", sans-serif;
  padding: 5px;
  border: 1px solid black;
  width: 300px;
  height: 100vh;
`;

const Title = styled.h1`
  color: black;
`;

const SearchField = styled.input`
  margin: 10px 20px;
  height: 20px;
  font-family: "Poppins", sans-serif;
  border: none;
  border-bottom: 1px solid lightgrey;
  padding: 5px;
  :focus {
    outline: none;
  }
`;

const TableListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 5px;
  border-bottom: 1px solid lightgrey;
  transition: 0.2s;
  :hover {
    transform: scale(1.05);
    background-color: #e3e0e9;
  }
`;

const SelectTableBtn = styled.button`
  border: none;
  background: transparent;
  :hover {
    font-weight: bold;
    color: lightcoral;
  }
`;

const ListOfResults = styled.ul`
  padding: 10px 20px;
  overflow: scroll;
`;

interface ITableName {
  name: string;
}

interface Props {
  listOfTableNames: Array<ITableName>;
}

const SearchPanel: React.SFC<Props> = ({ listOfTableNames }) => {
  const [userInputForTables, setUserInputForTables] = useState("");
  const [filteredTables, setFilteredTables] = useState([]);
  const [allTables, setAllTables] = useState([]);

  useEffect(() => {
    setAllTables(listOfTableNames);
  }, [listOfTableNames]);

  useEffect(() => {
    let filtered = [];
    allTables.forEach(tableName => {
      const regex = new RegExp(userInputForTables);
      if (regex.test(tableName))
        filtered.push(
          <TableListItem key={tableName}>
            {tableName}
            <SelectTableBtn>Add</SelectTableBtn>
          </TableListItem>
        );
    });
    setFilteredTables(filtered);
  }, [userInputForTables, allTables]);

  return (
    <LeftPanelTableListWrapper>
      <Title>Tables</Title>
      <SearchField
        type="text"
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
      ></SearchField>
      {filteredTables.length > 0 && (
        <ListOfResults>{filteredTables}</ListOfResults>
      )}
      {!filteredTables.length && (
        <div>Sorry, no search results, please try again!!!!!!!!!!!</div>
      )}
    </LeftPanelTableListWrapper>
  );
};

export default SearchPanel;

