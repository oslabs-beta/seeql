import * as React from 'react';
import styled from 'styled-components';

const OmniBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OmniBoxInputText = styled.textarea`
  font-family: 'Poppins', sans-serif;
  border: none;
  background-color: #E8ECF1;
  padding: 8px;
  height: 100px;
  letter-spacing: 2px;
  resize: none;
  width: 100%;
  :focus {
    outline: none;
  }
`;

const ExecuteQueryButton = styled.button`
  font-family: 'Poppins', sans-serif;
  border: ${props => props.theme.executeButton.border};
  background-color: ${props => props.theme.executeButton.baseColor};
  transition: 0.2s;
  color: ${props => props.theme.executeButton.fontColor};
  text-align: center;
  padding: 8px;
  font-size: 80%;
  border-radius: 0px 0px 3px 3px;
  transition: 0.2s;
  span {
    cursor: pointer;
    display: inline - block;
    position: relative;
    transition: 0.5s;
  }

  span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}   
  :hover {
    span {
      padding-right: 15px;
    }
    span:after {
      opacity: 1;
      right: 0;
    }
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
          <span>{loadingQueryStatus ? 'Loading query results...' : 'Execute Query'}</span>
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
