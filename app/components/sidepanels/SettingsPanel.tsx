import * as React from 'react';
import { useReducer, useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import Context from '../../contexts/themeContext';
import themeReducer from '../../reducers/themeReducer';

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  height: 100vh;
  padding: 40px;
  background-color: ${props => props.theme.panel.baseColor};
  color: ${props => props.theme.panel.fontColor};
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
`;
const BottomSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  color: ${props => props.theme.panel.headerColor};
  font-size: 30px;
`;
const Label = styled.label`
  color: ${props => props.theme.panel.fontColor};
  padding: 10px 0;
`;
const SignOut = styled.span`
  color: ${props => props.theme.link.signOut};
`;

const SettingsPanel = ({ intervalId }) => {
  const [context, setContext] = useContext(Context);
  const [state, dispatch] = useReducer(themeReducer, context);
  const [activeMode, setActiveMode] = useState('default');

  const logOut = () => {
    clearInterval(intervalId);
    ipcRenderer.send('logout-to-main', 'userlogout');
  };

  useEffect(() => {
    setContext(state);
  }, [state]);

  return (
    <PanelWrapper>
      <TopSection>
        <Title>Settings</Title>

        <DivWrapper>
          <Label>Theme</Label>
          <select
            name="modeList"
            onChange={e => {
              setActiveMode(e.target.value);
              dispatch({
                type: 'CHANGE_MODE',
                selected: e.target.value,
                payload: activeMode
              });
            }}
          >
            {context.map(modeObj => (
              <option key={modeObj.value} value={modeObj.value}>
                {modeObj.value}
              </option>
            ))}
          </select>
        </DivWrapper>
        <DivWrapper>
          <Label>Font Size</Label>
          <select>
            <option value="">Normal</option>
            <option value="">small</option>
            <option value="">large</option>
            <option value="">Extra-Large</option>
          </select>
        </DivWrapper>
      </TopSection>
      <BottomSection>
        <NavLink onClick={logOut} to="/">
          <SignOut>SignOut</SignOut>
        </NavLink>
      </BottomSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
