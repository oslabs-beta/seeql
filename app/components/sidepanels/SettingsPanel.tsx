import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import { SettingsHead, SignOutLink } from './sidePanelMolecules/titles'
import { CircleQuestion, CircleInformation, Pin, License } from 'grommet-icons';


const SMiddleWrapper = styled.div`
  height: 100%;
  padding: 20px 0px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SWrapper = styled.div`
 padding: 10px 0px;
 font-size: 80%;
`

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 10px 20px;
  justify-content: space-between
   transition: all 0.2s ease-in-out;
`;

const LabelTextWrapper = styled.div`
  display: flex;
  align-items: center;
    overflow-wrap: break-word;
    padding: 5px 0px;
`
const InputLabel = styled.span`
  font-size: 80%;
  letter-spacing: 2px;
  color: #485360;
`;

const SInputLabel = styled(InputLabel)`
  text-decoration: underline;
  font-weight: bold;
`

const SettingsPanel = ({ intervalId }) => {
  const logOut = () => {
    clearInterval(intervalId);
    ipcRenderer.send('logout-to-main', 'userlogout');
  };

  return (
    <PanelWrapper>

      <SettingsHead />
      <SMiddleWrapper>
        <SWrapper>
          <LabelTextWrapper>
            <License style={{ height: '15px' }} color="#28C3AA" /><InputLabel>Primary Key</InputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <License style={{ height: '15px' }} color="#6532CC" /><InputLabel> Foreign Key</InputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <Pin style={{ height: '15px' }} color="#FF98BB" /><InputLabel>Pin a table to the top of the list</InputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <CircleInformation style={{ height: '15px' }} color="#149BD2" /><InputLabel>View table info</InputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <SInputLabel>Features</SInputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <InputLabel>- Click on the rows of a table to automatically generate a query</InputLabel>
          </LabelTextWrapper>
          <LabelTextWrapper>
            <InputLabel>- Use the search to find a table quickly</InputLabel>
          </LabelTextWrapper>
        </SWrapper>
        <NavLink onClick={logOut} to="/">
          <SignOutLink />

        </NavLink>
      </SMiddleWrapper>
    </PanelWrapper>
  );
};

export default SettingsPanel;
