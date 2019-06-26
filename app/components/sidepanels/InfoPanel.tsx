import * as React from 'react';
import styled from 'styled-components';

import { InformationPanel } from './sidePanelMolecules/titles'
import { Grommet } from "grommet";
import { grommet } from 'grommet/themes';
import { CircleInformation, License, Pin } from 'grommet-icons';

interface ISidePanelTableWrapperProps {
  sidePanelVisibility: boolean;
}

const TitleWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  
`

const SidePanelTableListWrapper = styled.div<ISidePanelTableWrapperProps>`
  width: ${({ sidePanelVisibility }) =>
    sidePanelVisibility ? '210px' : '0px'};
  height: 100%;
  transition: width 500ms ease-in-out;
  overflow: scroll;
   transition: all 0.2s ease-in-out;
`;

const LabelTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
    overflow-wrap: break-word;
    padding: 5px 0px;
    align-items: center;
`

const InfoSection = styled.div`
  overflow-wrap: break-word;
  margin: 20px;
  overflow: hidden;
`;

const SEmptyState = styled.div`
margin: 20px;
  font-family: 'Poppins', sans-serif;
`

const Text = styled.p`
  font-size: 80%;
  font-weight: bold;
    font-family: 'Poppins', sans-serif;
  color: #485360;
  padding: 0px 2px;
  :hover {
    background-color:  #f4f4f4;
  }
`;

const Label = styled.label`
  font-size: 70%;
    font-family: 'Poppins', sans-serif;
  color:#485360;
  font-weight: none;
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
  sidePanelVisibility,
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
            {key.column_name} <Label as="span"> from table </Label>
            {key.foreign_table_name}({key.foreign_column_name})
          </Text>
        </li>
      );
    });
  }

  for (const foreignTableOfPrimary in foreignKeysOfPrimary) {
    primaryKeyRelationships.push(
      <li>
        <Text> {foreignTableOfPrimary}({foreignKeysOfPrimary[foreignTableOfPrimary]})</Text>
      </li>
    );
  }

  return (
    <Grommet theme={grommet} style={{ height: '100%', width: '100%' }}>
      <SidePanelTableListWrapper sidePanelVisibility={sidePanelVisibility}>
        <TitleWrapper><InformationPanel /></TitleWrapper>
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
                    color="#28C3AA" /> Primary key is used in:</Label>
                  <ul>{primaryKeyRelationships}</ul>
                </div>
              )}
            </LabelTextWrapper>
            <LabelTextWrapper>
              {foreignKeyRelationships.length > 0 && (
                <div>
                  <Label><License
                    size="small"
                    color="#6532CC" /> Foreign keys in this table:</Label>
                  <ul>{foreignKeyRelationships}</ul>
                </div>
              )}
            </LabelTextWrapper>
          </InfoSection>
        ) : (
            <SEmptyState>
              You haven't selected a table yet, click on the <CircleInformation style={{ height: '20px' }} color="#149BD2" /> in a table to see more information.
              <br /><br />
              To save a table to the top of the list, click on the {` `}
              <Pin
                color="#FF98BB"
              /> in a table.
          </SEmptyState>
          )}
      </SidePanelTableListWrapper>
    </Grommet>
  );
};

export default InfoPanel;