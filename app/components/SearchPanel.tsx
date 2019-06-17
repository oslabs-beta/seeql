import * as React from 'react';
import styled from 'styled-components';

interface ILeftPanelTableWrapperProps {
  visible: boolean;
}

const LeftPanelTableListWrapper = styled.div<ILeftPanelTableWrapperProps>`
  color: black;
  padding: 40px;
  width: ${({ visible }) => (visible ? '300px' : '0px')};
  height: 100vh;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.fontColor};
  transition: width 500ms ease-in-out;
`;

const InfoSection = styled.div`
  overflow-wrap: break-word;
`;

const Title = styled.h1`
  color: ${props => props.theme.fontColor};
`;

const Text = styled.p`
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 12px;
`;

// interface IForeignKeys {
//   column_name?: string
//   constraint_name?: string
//   foreign_column_name?: string
//   foreign_table_name?: string
//   foreign_table_schema?: string
//   table_name?: string
//   table_schema?: string
// }

// interface IColumns {
//   characterlength?: string
//   columnname?: string
//   datatype?: string
//   defaultvalue?: string
// }

interface ISelectedTable {
  columns?: any[];
  foreignKeys?: any[];
  primaryKey?: string;
  table_name?: string;
  foreignKeysOfPrimary?: any;
}

interface Props {
  activeTableInPanel: ISelectedTable;
  visible: boolean;
}

const SearchPanel: React.SFC<Props> = ({ activeTableInPanel, visible }) => {
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
            {key.column_name} <Label as="span">from table</Label>
            {key.foreign_table_name}({key.foreign_column_name})
          </Text>
        </li>
      );
    });
  }

  for (const foreignTableOfPrimary in foreignKeysOfPrimary) {
    primaryKeyRelationships.push(
      <li>
        {foreignTableOfPrimary}({foreignKeysOfPrimary[foreignTableOfPrimary]})
      </li>
    );
  }

  return (
    <LeftPanelTableListWrapper visible={visible}>
      <Title>Information</Title>
      {Object.keys(activeTableInPanel).length > 0 ? (
        <InfoSection>
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
        </InfoSection>
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
