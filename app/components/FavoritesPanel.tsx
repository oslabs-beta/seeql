import * as React from "react";
import styled from "styled-components";

const PanelWrapper = styled.div`
  color: black;
  font-family: "Poppins", sans-serif;
  padding: 40px;
  font-size: 30px;
  width: 300px;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.fontColor};
`;

const FavoritesPanel = () => {
  return (
    <PanelWrapper>
      Welcome to favorites, this feature is coming soon!
    </PanelWrapper>
  );
};

export default FavoritesPanel;
