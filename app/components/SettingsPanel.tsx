import * as React from "react";
import { useContext, useReducer } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Context from "../contexts/themeContext";
import themeReducer from "../reducers/themeReducer";

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  font-family: "Poppins", sans-serif;
  padding: 20px;
  width: 300px;
  height: 100vh;
  padding: 40px;
  background-color: ${props => props.theme.backgroundColorLight};
`;
// background-color: #e8ecf1;

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
  font-size: 30px;
`;
const Label = styled.label`
  color: black;
  padding: 10px 0;
`;

const SettingsPanel = () => {
  //   const redirectHome = () => <Redirect to="/" />;
  const context = useContext(Context);
  const [state, dispatch] = useReducer(themeReducer, context);

  console.log("STAte", state);
  console.log("context", context);
  return (
    <PanelWrapper>
      <TopSection>
        <Title>Settings</Title>

        <DivWrapper>
          <Label>Theme</Label>
          {/* <select>
            <option value="">seeQl</option>
            <option value="">'K'</option>
            <option value="">'A'</option>
            <option value="">'T'</option>
            <option value="">'A'</option>
          </select> */}
          <button
            onClick={() => {
              dispatch({ type: "TOGGLE_DARK" });
            }}
          >
            TOGGLE THEME
          </button>
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
        {/* {console.log('in div', state.lightTheme.backgroundColor)} */}
        <div style={state}>CHANGE ME HEY BLAHHSLAH</div>
        <NavLink to="/" activeStyle={{ color: "black " }}>
          Sign Out
        </NavLink>
      </BottomSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
