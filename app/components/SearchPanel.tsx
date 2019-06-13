import * as React from "react";
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

const Text = styled.p`
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 8px;
`;

interface ISelectedTable {
  columns?: Array<any>;
  foreignKeys?: Array<any>;
  primaryKey?: string;
  table_name?: string;
  foreignKeysOfPrimary?: any;
}

interface Props {
  searchInput: any;
  activeTableInPanel: ISelectedTable;
}

const SearchPanel: React.SFC<Props> = ({
  searchInput,
  activeTableInPanel
}) => {
  const {
    table_name,
    primaryKey,
    foreignKeys,
    foreignKeysOfPrimary
  } = activeTableInPanel;
  const foreignKeyRelationships = [];
  const primaryKeyRelationships = [];

  if (foreignKeys) {
    foreignKeys.forEach(key => {
        foreignKeyRelationships.push(
          <li>
            <Text>
              {key.column_name} <Label as="span">from table</Label>{" "}
              {key.foreign_table_name}({key.foreign_column_name})
            </Text>
          </li>
        );
    })
  }

  for (let foreignTableOfPrimary in foreignKeysOfPrimary) {
      primaryKeyRelationships.push(
        <li>
          {foreignTableOfPrimary}({foreignKeysOfPrimary[foreignTableOfPrimary]})
        </li>
      );
  }

  return (
    <LeftPanelTableListWrapper>
      <Title>Information</Title>

      <SearchField
        type="text"
        placeholder="Search for a table"
        onChange={searchInput}
      ></SearchField>
      {Object.keys(activeTableInPanel).length > 0 ? (
        <div>
          <Label>table name</Label>
          <Text>{table_name}</Text>
          <Label>primary key</Label>
          <Text>{primaryKey}</Text>
          {primaryKeyRelationships.length === 0 && (
            <Label>The primary key is not used in any other table</Label>
          )}
          {primaryKeyRelationships.length > 0 && (
            <div>
              <Label>The primary key is referenced in</Label>
              <ul>{primaryKeyRelationships}</ul>
            </div>
          )}
          {foreignKeyRelationships.length === 0 && (
            <Label>This table does not have any foreign keys</Label>
          )}
          {foreignKeyRelationships.length > 0 && (
            <div>
              <Label>foreign keys in this table are</Label>
              <ul>{foreignKeyRelationships}</ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          You haven't selected a table yet, click on a table to see their
          information
        </div>
      )}
    </LeftPanelTableListWrapper>
  );
};

export default SearchPanel;
