import * as React from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/sidepanels/SettingsPanel';
import FavoritesPanel from '../components/sidepanels/FavoritesPanel';
import InfoPanel from '../components/sidepanels/InfoPanel';
import * as actions from '../actions/actions';

interface IPanelWrapperProps {
  sidePanelVisibility: boolean;
}

interface IIndTabProps {
  active: string;
  panel: string;
}

const PanelWrapper = styled.div<IPanelWrapperProps>`
  width: ${({ sidePanelVisibility }) =>
    sidePanelVisibility ? '300px' : '0px'};
  box-shadow: 2px 2px 8px lightgrey;
  margin: 20px;
  border-radius: 3px;
  height: 80%;
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
  font-family: 'Poppins', sans-serif;;
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
          <Tabs>
            <IndTab
              data-panel="info"
              panel="info"
              active={activePanel}
              onClick={() =>
                dispatchSidePanelDisplay(actions.changeToInfoPanel())
              }
            >
              I
              </IndTab>
            <IndTab
              data-panel="favorites"
              panel="favorites"
              active={activePanel}
              onClick={() =>
                dispatchSidePanelDisplay(actions.changeToFavPanel())
              }
            >
              F
              </IndTab>
            <IndTab
              data-panel="settings"
              panel="settings"
              active={activePanel}
              onClick={() =>
                dispatchSidePanelDisplay(actions.changeToSettingsPanel())
              }
            >
              S
              </IndTab>
          </Tabs>
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
