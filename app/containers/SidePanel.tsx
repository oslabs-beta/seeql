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
  width: ${({ sidePanelVisibility }) => (sidePanelVisibility ? '375px' : '0px')};
  display: flex;
  justify-content: flex-start;
  transition: width 500ms ease-in-out;
`;
const ButtonMenu = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 60px;
`;

const IndTab = styled.button<IIndTabProps>`
  border: none;
  font-family: 'Poppins', sans-serif;
  border: none;
  border-radius: 0px 6px 6px 0px;
  padding: 5px;
  background-color: ${props =>
    props.active === props.panel ? '#e8ecf1' : '#fdfdfe'}
  
  :hover {
    font-weight: bold;
  }
  :focus {
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;
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
  activeTableInPanel: IAcitveTableInPanel;
  sidePanelVisibility: boolean;
  activePanel: string;
  dispatchSidePanelDisplay: (IDispatchSidePanelDisplayAction) => any;
}

const SidePanel: React.SFC<Props> = ({
  activeTableInPanel,
  sidePanelVisibility,
  activePanel,
  dispatchSidePanelDisplay
}) => {
  return (
    <PanelWrapper sidePanelVisibility={sidePanelVisibility}>
      {sidePanelVisibility && (
        <div>
          {activePanel === 'info' && (
            <InfoPanel
              sidePanelVisibility={sidePanelVisibility}
              activeTableInPanel={activeTableInPanel}
            />
          )}
          {activePanel === 'favorites' && <FavoritesPanel />}
          {activePanel === 'settings' && <SettingsPanel />}
        </div>
      )}
      <ButtonMenu>
        {sidePanelVisibility && (
          <Tabs>
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
        )}
      </ButtonMenu>
    </PanelWrapper>
  );
};

export default SidePanel;
