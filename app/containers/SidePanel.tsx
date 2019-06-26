import * as React from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/sidepanels/SettingsPanel';
import FavoritesPanel from '../components/sidepanels/FavoritesPanel';
import InfoPanel from '../components/sidepanels/InfoPanel';
import * as actions from '../actions/actions';
import { Grommet } from "grommet";
import { grommet } from 'grommet/themes';
import { UserSettings, CircleInformation } from 'grommet-icons';

interface IPanelWrapperProps {
  sidePanelVisibility: boolean;
}

interface IIndTabProps {
  active: string;
  panel: string;
}

const PanelWrapper = styled.div<IPanelWrapperProps>`
  width: ${({ sidePanelVisibility }) =>
    sidePanelVisibility ? '250px' : '0px'};
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 0px;
  justify-content: flex-start;
  background-color: #E6EAF2 ;
  height: 100%;
   transition: all 0.2s ease-in-out;
     font-family: 'Poppins', sans-serif;
`;

const SInnerPanelWrapper = styled.div`
  margin: 5px;
  background-color: white;
  height: 100%;
  border-radius: 3px;
  box-shadow: 1px 1px 4px #67809f;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IndTab = styled.button<IIndTabProps>`
  font-family: 'Poppins', sans-serif;
  border: none;
  border-bottom: ${({ active, panel }) => active === panel ? '2px solid #4B70FE' : '2px solid transparent'};
  margin: 5px;
  padding: 3px 0px;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    transform: scale(1.1);
    border-bottom: 2px solid #4B70FE;
  }
  :focus {
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin: 10px;
  height: 60px;
`;

const SSectionWrapper = styled.div`
  height: 100%;
  overflow: scroll;
`

interface IForeignKeysAffected {
  column: string;
  table: string;
}

interface IColumnsMetaData {
  characterlength?: string;
  columnname: string;
  datatype: string;
  defaultvalue: string;
}

interface IAcitveTableInPanel {
  columns?: IColumnsMetaData[];
  foreignKeys?: IForeignKeysAffected[];
  primaryKey?: string;
  table_name?: string;
  foreignKeysOfPrimary?: any;
}

interface IDispatchSidePanelDisplayAction {
  type: string;
}

interface Props {
  intervalId: number;
  activeTableInPanel: IAcitveTableInPanel;
  sidePanelVisibility: boolean;
  activePanel: string;
  dispatchSidePanelDisplay: (IDispatchSidePanelDisplayAction) => any;
}

const SidePanel: React.SFC<Props> = ({
  intervalId,
  activeTableInPanel,
  sidePanelVisibility,
  activePanel,
  dispatchSidePanelDisplay
}) => {
  return (
    <Grommet theme={grommet} style={{ height: '100%' }} >
      {sidePanelVisibility && (
        <PanelWrapper sidePanelVisibility={sidePanelVisibility} className="sidepanel">
          <SInnerPanelWrapper>
            <Tabs>
              <IndTab
                data-panel="info"
                panel="info"
                active={activePanel}
                onClick={() =>
                  dispatchSidePanelDisplay(actions.changeToInfoPanel())
                }
              >
                <CircleInformation color={activePanel === 'info' ? "#4B70FE" : '#485360'} />
              </IndTab>
              <IndTab
                data-panel="settings"
                panel="settings"
                active={activePanel}
                onClick={() =>
                  dispatchSidePanelDisplay(actions.changeToSettingsPanel())
                }
              >
                <UserSettings color={activePanel === 'settings' ? "#4B70FE" : '#485360'} />
              </IndTab>
            </Tabs>
            <SSectionWrapper>
              {activePanel === 'info' && (
                <InfoPanel
                  sidePanelVisibility={sidePanelVisibility}
                  activeTableInPanel={activeTableInPanel}
                />
              )}
              {activePanel === 'favorites' && <FavoritesPanel />}
              {activePanel === 'settings' && <SettingsPanel intervalId={intervalId} />}
            </SSectionWrapper>
          </SInnerPanelWrapper>
        </PanelWrapper>
      )
      }
    </Grommet >
  );
};

export default SidePanel;
