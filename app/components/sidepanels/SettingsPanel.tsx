import * as React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import NestedCollapsible from './sidePanelMolecules/doubleCollapsible'
import SingleCollapsible from './sidePanelMolecules/SingleCollapsible'
import { SettingsHead, SignOutLink } from './sidePanelMolecules/titles'


const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between
   transition: all 0.2s ease-in-out;
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
`;


const SettingsPanel = ({ intervalId }) => {
  const logOut = () => {
    clearInterval(intervalId);
    ipcRenderer.send('logout-to-main', 'userlogout');
  };

  return (
    <PanelWrapper>
      <TopSection>

        <SettingsHead/>
      <NestedCollapsible/>
          <SingleCollapsible/>
        <NavLink onClick={logOut} to="/">
          <SignOutLink/>

        </NavLink>
      </TopSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
