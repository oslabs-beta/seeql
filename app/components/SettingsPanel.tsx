import * as React from 'react';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 5px;
  border: 1px solid black;
  width: 300px;
  height: 100vh;
`


const SettingsPanel = () => {
    return (
        <PanelWrapper>
            This is Settings Panel
        </PanelWrapper>
    );
}

export default SettingsPanel;