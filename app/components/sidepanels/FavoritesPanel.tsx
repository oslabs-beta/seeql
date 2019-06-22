import * as React from 'react';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  color: black;
  padding: 40px;
  font-size: 30px;
  width: 300px;
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.panel.baseColor};
  color: ${props => props.theme.panel.fontColor};
`;

const FavoritesPanel = () => {
  return (
    <PanelWrapper>
      Welcome to favorites, this feature is coming soon!
    </PanelWrapper>
  );
};

export default FavoritesPanel;
