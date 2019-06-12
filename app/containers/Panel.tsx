import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import SettingsPanel from '../components/SettingsPanel'
import FavoritesPanel from '../components/FavoritesPanel';
import SearchPanel from '../components/SearchPanel';

const PanelWrapper = styled.div`
    height: 100vh;
    width: 400px;
    border: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
`
const ButtonMenu = styled.div`
    display: flex;
    flex-direction: column;
    width: 50px;
`

interface ISelectedTable {
  columns?: Array<any>
  foreignKeys?: Array<any>
  primaryKey?: string
  table_name?: string
}

interface Props {
    searchInput: any
    activeTableInPanel: ISelectedTable
    onlyPinned: Array<any>
    removeFromPinned:(Event) => void
    addToPinned:(Event) => void
}

const Panel: React.SFC<Props> = ({ searchInput, activeTableInPanel, onlyPinned,  removeFromPinned,
  addToPinned}) => {

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
        <PanelWrapper>
            { visible &&
            <div>
            { activePanel==='search' &&
            <SearchPanel 
              removeFromPinned={removeFromPinned}
              addToPinned={addToPinned}
              onlyPinned={onlyPinned}
              searchInput={searchInput}
              activeTableInPanel={activeTableInPanel}
            />}
            { activePanel==='favorites' &&
            <FavoritesPanel />}
            { activePanel==='settings' &&
            <SettingsPanel />}
            </div>}
            <ButtonMenu>
                <button 
                  onClick={togglePanelVisibility}
                >Collapse Panel</button>
                <button 
                  data-panel='search' 
                  onClick={displayActivePanelComponent}
                >Table Info</button>
                <button 
                  data-panel='favorites' 
                  onClick={displayActivePanelComponent}>
                  Favorites
                </button>
                <button 
                  data-panel='settings' 
                  onClick={displayActivePanelComponent}>
                  Settings
                </button>
            </ButtonMenu>
        </PanelWrapper>
    )
}


export default Panel;