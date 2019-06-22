import * as React from 'react';
import styled from 'styled-components';

const OmniBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OmniBoxInputText = styled.textarea`
  font-family: 'Poppins', sans-serif;
  border: 1px solid lightgrey;
  padding: 8px;
  height: 100px;
  border-radius: 3px;
  letter-spacing: 2px;
  resize: none;
  width: 100%;

  :focus {
    outline: none;
  }
`;

const ExecuteQueryButton = styled.button`
  font-family: 'Poppins', sans-serif;
  border: ${props=>props.theme.executeButton.border};
  background-color: ${props=>props.theme.executeButton.baseColor};
  transition: 0.2s;
  color: ${props =>props.theme.executeButton.fontColor};
  text-align: center;
  padding: 5px;
  font-size: 80%;
  transition: 1s;

  :hover {
    background-image: linear-gradient(to bottom right, #49cefe, #c647bc);
  }

  :focus {
    outline: none;
  }
`;

interface IOmniBoxInputProps {
  omniBoxView: string;
  userInputQuery: string;
  loadingQueryStatus: boolean;
  userInputForTables: string;
  setUserInputQuery: (any) => any;
  executeQuery: (any) => any;
  setUserInputForTables: (any) => any;
}

const OmniBoxInput: React.SFC<IOmniBoxInputProps> = ({
  omniBoxView,
  setUserInputQuery,
  userInputQuery,
  executeQuery,
  loadingQueryStatus,
  setUserInputForTables,
  userInputForTables
}) => {
  if (omniBoxView === 'SQL') {
    return (
      <OmniBoxWrapper>
        <OmniBoxInputText
          onChange={e => setUserInputQuery(e.target.value)}
          value={userInputQuery}
        ></OmniBoxInputText>
        <ExecuteQueryButton
          onClick={executeQuery}
          disabled={loadingQueryStatus}
        >
          {loadingQueryStatus ? 'Loading query results...' : 'Execute Query'}
        </ExecuteQueryButton>
      </OmniBoxWrapper>
    );
  }
  if (omniBoxView === 'plain') {
    return (
      <OmniBoxInputText
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
        value={userInputForTables}
      ></OmniBoxInputText>
    );
  }
};

export default OmniBoxInput;
