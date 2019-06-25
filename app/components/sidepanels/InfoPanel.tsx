import * as React from 'react';
import styled from 'styled-components';

import { InformationPanel } from './sidePanelMolecules/Headers'
import { Grommet } from "grommet";
import { grommet } from 'grommet/themes';
import { License, CircleInformation } from 'grommet-icons';


interface ISidePanelTableWrapperProps {
  sidePanelVisibility: boolean;
}

const SidePanelTableListWrapper = styled.div<ISidePanelTableWrapperProps>`
  color: black;
  padding: 20px;
    width: 250px;
  background-color: transparent;
  transition: width 500ms ease-in-out;
`;

const InfoSection = styled.div`
  overflow-wrap: break-word;
  padding: 30px 0px;
`;

const Text = styled.p`
  font-family: 'Poppins', sans-serif;
  color: black;
    font-size: 14px;
  font-weight: bold;
    padding: 1px 5px;
  :hover{
    background-color: #f4f4f4;
  }
`;

const LabelTextWrapper = styled.div`
  margin: 5px 0px;
`

const Label = styled.label`
  font-size: 12px;
  padding: 2px 5px;
  color: black;
    font-family: 'Poppins', sans-serif;
`;

const EmptyState = styled.div`
  padding: 40px 0px;
  font-size: 18px;
`

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
            {key.column_name} from table
            {key.foreign_table_name}, {key.foreign_column_name}
          </Text>
        </li>
      );
    });
  }

  for (const foreignTableOfPrimary in foreignKeysOfPrimary) {
    primaryKeyRelationships.push(
      <li>
        <Text>{foreignTableOfPrimary}, {foreignKeysOfPrimary[foreignTableOfPrimary]}</Text>
      </li>
    );
  }

  return (
    <SidePanelTableListWrapper sidePanelVisibility={sidePanelVisibility}>
      <InformationPanel />
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
      </SidePanelTableListWrapper>
    </Grommet>
  );
};

export default InfoPanel;
