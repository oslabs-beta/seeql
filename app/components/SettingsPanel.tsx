import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  border: 1px solid black;
  width: 300px;
  height: 100vh;
  padding: 40px;
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
  color: black;
  padding-bottom: 10px;
`;
const Label = styled.label`
  color: black;
  padding: 10px 0;
`;

const SettingsPanel = () => {
  //   const redirectHome = () => <Redirect to="/" />;

  return (
    <PanelWrapper>
      <TopSection>
        <Title>Settings</Title>

        <DivWrapper>
          <Label>Theme</Label>
          <select>
            <option value="">seeQl</option>
            <option value="">'K'</option>
            <option value="">'A'</option>
            <option value="">'T'</option>
            <option value="">'A'</option>
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
        <div></div>
        <NavLink to="/" activeStyle={{ color: 'black ' }}>
          Sign Out
        </NavLink>
      </BottomSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
