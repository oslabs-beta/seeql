import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import NestedCollapsible from './sidePanelMolecules/doubleCollapsible'
import SingleCollapsible from './sidePanelMolecules/SingleCollapsible'
import { SettingsHead, SignOutLink } from './sidePanelMolecules/titles'


const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between
  color: black;
  font-family: 'Poppins', sans-serif;˜
  padding: 20px;
  padding: 40px;
    width: 250px;
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
        <SettingsHead />
        <NestedCollapsible />
        <SingleCollapsible />
        <NavLink onClick={logOut} to="/">
          <SignOutLink />
        </NavLink>
      </TopSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
