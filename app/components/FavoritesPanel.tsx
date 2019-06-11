import * as React from 'react';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 5px;
  width: 100%;
  border: 1px solid black;
`

const FavoritesPanel = () => {
    return (
        <PanelWrapper>
            This is favorites Panel
        </PanelWrapper>
    )

}

export default FavoritesPanel;