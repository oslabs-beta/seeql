import * as React from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/sidepanels/SettingsPanel';
import FavoritesPanel from '../components/sidepanels/FavoritesPanel';
import InfoPanel from '../components/sidepanels/InfoPanel';
import * as actions from '../actions/actions';
import { Grommet, Box } from "grommet";
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
  justify-content: flex-start;
  transition: width 500ms ease-in-out;
`;
const ButtonMenu = styled.div`
  display: flex;
  justify-content: center;
  
`;

const IndTab = styled.button<IIndTabProps>`
  border: none;
  padding: 5px;
  cursor: pointer;

  :hover {
    transform: scale(1.1);
  }
  :focus {
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: 'Poppins', sans-serif;
  width: 250px;
`;

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
    <Grommet theme={grommet}>
      {sidePanelVisibility && (
        <Box cdirection="row"
          border={{ color: 'brand', size: 'large' }}
          pad="medium"
          height='100%'
        >
          <PanelWrapper sidePanelVisibility={sidePanelVisibility}>
            <ButtonMenu>
              <Tabs>
                <IndTab
                  data-panel="info"
                  panel="info"
                  active={activePanel}
                  onClick={() =>
                    dispatchSidePanelDisplay(actions.changeToInfoPanel())
                  }
                >
                  <CircleInformation />
                </IndTab>
                <IndTab
                  data-panel="settings"
                  panel="settings"
                  active={activePanel}
                  onClick={() =>
                    dispatchSidePanelDisplay(actions.changeToSettingsPanel())
                  }
                >
                  <UserSettings />
                </IndTab>
              </Tabs>
            </ButtonMenu>
            <div>
              {activePanel === 'info' && (
                <InfoPanel
                  sidePanelVisibility={sidePanelVisibility}
                  activeTableInPanel={activeTableInPanel}
                />
              )}
              {activePanel === 'favorites' && <FavoritesPanel />}
              {activePanel === 'settings' && <SettingsPanel intervalId={intervalId} />}
            </div>
          </PanelWrapper>
        </Box>
      )
      }
    </Grommet >
  );
};

export default SidePanel;
