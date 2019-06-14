import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/SettingsPanel'
import FavoritesPanel from '../components/FavoritesPanel';
import SearchPanel from '../components/SearchPanel';

interface IPanelWrapperProps {
  visible: boolean
}

interface IIndTabProps {
  active: string
  panel: string
}

const PanelWrapper = styled.div<IPanelWrapperProps>`
    height: 100vh;
    width: ${({visible}) => visible ? '400px' : '50px'};
    display: flex;
    justify-content: space-between;
`
const ButtonMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    width: 60px;
`

const IndTab = styled.button<IIndTabProps>`
  border: none;
  font-family: 'Poppins', sans-serif;
  border: none;
  border-radius: 0px 6px 6px 0px;
  padding: 5px;
  background-color: ${(props) => (props.active === props.panel) ? '#e8ecf1' : '#fdfdfe' }
  
  :hover {
    font-weight: bold;
  }

  :focus {
    outline: none;
  }
`

const Tabs = styled.div`
   display: flex;
   flex-direction: column;
   height: 100px;
   justify-content: space-between;
   font-family: 'Poppins', sans-serif;
   margin-top: 10px;
`

const CollapseBtn = styled.button`
  border: none;
  margin-bottom: 10px;

  :focus {
    outline: none;
  }

  :hover {
    font-weight: bold;
  }
`

interface ISelectedTable {
  columns?: Array<any>
  foreignKeys?: Array<any>
  primaryKey?: string
  table_name?: string
  foreignKeysOfPrimary?: any
}

interface Props {
    searchInput: any
    activeTableInPanel: ISelectedTable
}

const Panel: React.SFC<Props> = ({ 
  searchInput, 
  activeTableInPanel}) => {

    const [activePanel, setActivePanel] = useState('search');
    const [visible, setVisible] = useState(true);

    const displayActivePanelComponent = (e) => {
        setActivePanel(e.target.dataset.panel);
    }

    const togglePanelVisibility = () => {
        if (visible) setVisible(false);
        else setVisible(true);
    }

    return (
        <PanelWrapper visible={visible}>
            { visible &&
            <div>
            { activePanel==='search' &&
            <SearchPanel 
              searchInput={searchInput}
              activeTableInPanel={activeTableInPanel}
            />}
            { activePanel==='favorites' &&
            <FavoritesPanel />}
            { activePanel==='settings' &&
            <SettingsPanel />}
            </div>}
            <ButtonMenu>
              <Tabs>
                <IndTab 
                  data-panel='search' 
                  panel='search'
                  active={activePanel}
                  onClick={displayActivePanelComponent}
                >Table Info</IndTab>
                <IndTab 
                  data-panel='favorites'
                  panel='favorites' 
                  active={activePanel}
                  onClick={displayActivePanelComponent}>
                  Favorites
                </IndTab>
                <IndTab 
                  data-panel='settings' 
                  panel='settings'
                  active={activePanel}
                  onClick={displayActivePanelComponent}>
                  Settings
                </IndTab>
                </Tabs>
                <CollapseBtn 
                  onClick={togglePanelVisibility}
                  data-active={activePanel}
                > {visible ? `< Hide Menu` : `Show Menu >`} </CollapseBtn>
            </ButtonMenu>
        </PanelWrapper>
    )
}


export default Panel;