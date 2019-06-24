import * as React from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/sidepanels/SettingsPanel';
import FavoritesPanel from '../components/sidepanels/FavoritesPanel';
import InfoPanel from '../components/sidepanels/InfoPanel';
import * as actions from '../actions/actions';
import { Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

interface IPanelWrapperProps {
  sidePanelVisibility: boolean;
}

interface IIndTabProps {
  active: string;
  panel: string;
}

const PanelWrapper = styled.div<IPanelWrapperProps>`
  width: ${({ sidePanelVisibility }) =>
    sidePanelVisibility ? '375px' : '0px'};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: visibility 500ms ease-in-out;
`;
const ButtonMenu = styled.div`
  display: flex;
  justify-content: center;
  background-color: #e8ecf1;
`;

const IndTab = styled.button<IIndTabProps>`
  border: none;
  font-family: 'Poppins', sans-serif;
  border: none;
  padding: 5px;

  background-color: ${props => props.active === props.panel ? props.theme.tabs.baseColor : props.theme.panel.baseColorActive};
  color: ${props => props.theme.tabs.fontColor};

  :hover {
    font-weight: bold;
  }
  :focus {
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  padding: 50px 0px 5px 5px;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;
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
    <React.Fragment>
      {sidePanelVisibility && (
        <PanelWrapper sidePanelVisibility={sidePanelVisibility}>
          <ButtonMenu>
            <Tabs>
              <Icon icon={IconNames.GLOBE} iconSize={Icon.SIZE_LARGE} intent={Intent.PRIMARY} />
              <IndTab
                data-panel="info"
                panel="info"
                active={activePanel}
                onClick={() =>
                  dispatchSidePanelDisplay(actions.changeToInfoPanel())
                }
              >
                Table Info
              </IndTab>
              <IndTab
                data-panel="favorites"
                panel="favorites"
                active={activePanel}
                onClick={() =>
                  dispatchSidePanelDisplay(actions.changeToFavPanel())
                }
              >
                Favorites
              </IndTab>
              <IndTab
                data-panel="settings"
                panel="settings"
                active={activePanel}
                onClick={() =>
                  dispatchSidePanelDisplay(actions.changeToSettingsPanel())
                }
              >
                Settings
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
      )}
    </React.Fragment>
  );
};

export default SidePanel;
