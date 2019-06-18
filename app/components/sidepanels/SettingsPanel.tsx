import * as React from 'react';
import { useReducer, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Context from '../../contexts/themeContext';
import themeReducer from '../../reducers/themeReducer';

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  width: 300px;
  height: 100vh;
  padding: 40px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.fontColor};
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
  color: ${props => props.theme.fontColor};
  font-size: 30px;
`;
const Label = styled.label`
  color: ${props => props.theme.fontColor};
  padding: 10px 0;
`;

const SettingsPanel = () => {
  const [context, setContext] = useContext(Context);
  const [state, dispatch] = useReducer(themeReducer, context);
  const [activeMode, setActiveMode] = useState('default')
  setContext(state)


//when clicked, dispatch action to reducer with payload of active mode obj(to deactivate, and selected mode obj to activate)
  return (
    <PanelWrapper>
      <TopSection>
        <Title>Settings</Title>

        <DivWrapper>
          <Label>Theme</Label>
          <select
            value={context}
            name="modeList"
            onChange={e => {
              dispatch({type:'CHANGE_MODE', selected: e.target.value, payload: activeMode})
              setActiveMode(e.target.value)
            }}
          >
            {context.map(modeObj => (
              <option key={modeObj.value} value = {modeObj.value} >
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
        <div style={state}>CHANGE ME HEY BLAHHSLAH</div>
        <NavLink to="/" activeStyle={{ color: 'black ' }}>
          Sign Out
        </NavLink>
      </BottomSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;


