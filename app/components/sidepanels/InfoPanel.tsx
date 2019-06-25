import * as React from 'react';
import styled from 'styled-components';
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

const Title = styled.p`
  font-family: 'Poppins', sans-serif;
  color: black;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 20px 0px;
  border-bottom: 3px solid grey;
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
    <Grommet theme={grommet}>
      <SidePanelTableListWrapper sidePanelVisibility={sidePanelVisibility}>
        <Title><CircleInformation size="medium" color="#149BD2" /><span> Information</span></Title>
        {Object.keys(activeTableInPanel).length > 0 ? (
          <InfoSection>
            <LabelTextWrapper>
              <Label>table</Label>
              <Text>{table_name}</Text>
            </LabelTextWrapper>
            <LabelTextWrapper>
              <Label>primary key</Label>
              <Text>{primaryKey}</Text>
            </LabelTextWrapper>
            <LabelTextWrapper>
              {primaryKeyRelationships.length > 0 && (
                <div>
                  <Label><License
                    size="small"
                    color="#f39c12" /> Primary key is used in:</Label>
                  <ul>{primaryKeyRelationships}</ul>
                </div>
              )}
            </LabelTextWrapper>
            <LabelTextWrapper>
              {foreignKeyRelationships.length > 0 && (
                <div>
                  <Label><License
                    size="small"
                    color="#6DDEF4" /> Foreign keys in this table:</Label>
                  <ul>{foreignKeyRelationships}</ul>
                </div>
              )}
            </LabelTextWrapper>
          </InfoSection>
        ) : (
            <EmptyState>
              You haven't selected a table yet, click on a the <CircleInformation style={{ height: '20px' }} color="#149BD2" /> in a table to see more information.
            </EmptyState>
          )}
      </SidePanelTableListWrapper>
    </Grommet>
  );
};

export default InfoPanel;
