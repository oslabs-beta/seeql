import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import NestedCollapsible from './sidePanelMolecules/doubleCollapsible'
import SingleCollapsible from './sidePanelMolecules/SingleCollapsible'
import { SettingsHead, SignOutLink } from './sidePanelMolecules/titles'

const SMiddleWrapper = styled.div`
  height: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SWrapper = styled.div`
  padding: 20px 0px;
`

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between
   transition: all 0.2s ease-in-out;
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
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
        <SMiddleWrapper>
          <SWrapper>
            <NestedCollapsible />
            <SingleCollapsible />
          </SWrapper>
          <NavLink onClick={logOut} to="/">
            <SignOutLink />

          </NavLink>
        </SMiddleWrapper>
      </TopSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
