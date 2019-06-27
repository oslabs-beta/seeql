import * as React from 'react';
import styled from 'styled-components';

const OmniBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OmniBoxInputText = styled.textarea`
  font-family: 'Poppins', sans-serif;
  font-size: 90%;
  border: none;
  background-color: #f1f1f1;
  padding: 10px;
  height: 100px;
  letter-spacing: 2px;
  resize: none;
  width: 100%;
  transition: all 0.2s;
  :focus {
    outline: none;
  }
`;

const ExecuteQueryButton = styled.button`
  transition: all 0.2s;
  text-align: center;
   background-color: #4B70FE;
  color: white;
  padding: 8px;
  font-size: 100%;
  border-radius: 0px 0px 3px 3px;
  transition: 0.2s;
  span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }
  span:after {
    content: ">>";
    position: absolute;
    opacity: 0;
    top: 0;
    right: -14px;
    transition: 0.5s;
  }   
  :hover {
    span {
      padding-right: 10px;
    } 
    span:after {
    opacity: 1;
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
  if (omniBoxView === 'Search') {
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