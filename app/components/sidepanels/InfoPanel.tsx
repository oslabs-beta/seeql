import * as React from 'react';
import styled from 'styled-components';

interface ISidePanelTableWrapperProps {
  sidePanelVisibility: boolean;
}

const SidePanelTableListWrapper = styled.div<ISidePanelTableWrapperProps>`
  color: black;
  padding: 40px;
  width: 300px;
  height: 100vh;
  background-color: 'white';
  color: 'black';
`;

const InfoSection = styled.div`
  overflow-wrap: break-word;
`;

const Title = styled.h1`
  color: 'black';
`;

const Text = styled.p`
  font-size: 100%;
  color: 'black';
`;

const Label = styled.label`
  font-size: 80%;
  color: 'black';
`;

interface ISelectedTable {
  columns?: any[];
  foreignKeys?: any[];
  primaryKey?: string;
  table_name?: string;
  foreignKeysOfPrimary?: any;
}

interface Props {
  activeTableInPanel: ISelectedTable;
  sidePanelVisibility: boolean;
}

const InfoPanel: React.SFC<Props> = ({
  activeTableInPanel,
  sidePanelVisibility
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
          <Text key={key}>
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
    <SidePanelTableListWrapper sidePanelVisibility={sidePanelVisibility}>
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
    </SidePanelTableListWrapper>
  );
};

export default InfoPanel;
