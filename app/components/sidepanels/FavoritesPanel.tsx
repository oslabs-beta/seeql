import * as React from 'react';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  padding: 20px;
  display: flex;
  width: 250px;
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
