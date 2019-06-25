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
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  padding: 40px;
    width: 250px;
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
`;
const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
font-size: 30px;
`;
const Label = styled.label`
  padding: 10px 0;
`;
const SignOut = styled.span`
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
              ipcRenderer.send('user-theme-selected', e.target.value);
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
        <NavLink onClick={logOut} to="/">
          <SignOut>SignOut</SignOut>
        </NavLink>
      </TopSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
