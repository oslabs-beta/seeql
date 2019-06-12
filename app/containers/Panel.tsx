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

interface ITableName {
    name: string
}

interface Props {
    listOfTableNames: Array<ITableName>
    searchInput: any
    filteredTables: any
}

const Panel: React.SFC<Props> = ({ listOfTableNames, searchInput, filteredTables }) => {

    const [activePanel, setActivePanel] = useState('search');
    const [visible, setVisible] = useState(true);

    
    console.log('active', activePanel)

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
              filteredTables={filteredTables}
              listOfTableNames={listOfTableNames}
              searchInput={searchInput}
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
                >Search</button>
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