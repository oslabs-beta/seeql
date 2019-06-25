import * as React from 'react';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  color: black;
  padding: 20px;
  font-size: 30px;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const FavoritesPanel = () => {
  return (
    <PanelWrapper>
      Welcome to favorites, this feature is coming soon!
    </PanelWrapper>
  );
};

export default FavoritesPanel;
