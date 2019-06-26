import * as React from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { useState } from 'react';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';
// import { Search } from 'grommet-icons';

const OmniBoxWrapper = styled.div`
  box-shadow: 1px 1px 4px #67809f;
  background-color: white;
  padding: 10px;
`

const QueryResultError = styled.div`
  color: #ca333e;
  border-radius: 3px;
  border-left: 3px solid #ca333e;
  font-size: 80%;
  background-color: #f1c7ca;
  margin: 5px 0px;
  padding: 5px;
`;

interface IOmniBoxProps {
  userInputQuery: string;
  loadingQueryStatus: boolean;
  queryResultError: any;
  userInputForTables: string;
  setQueryResultError: (any) => any;
  setLoadingQueryStatus: (any) => any;
  setUserInputQuery: (any) => any;
  setUserInputForTables: (any) => any;
}

const OmniBoxContainer: React.SFC<IOmniBoxProps> = ({
  userInputQuery,
  loadingQueryStatus,
  setQueryResultError,
  setLoadingQueryStatus,
  setUserInputQuery,
  queryResultError,
  setUserInputForTables,
  userInputForTables
}) => {
  const [omniBoxView, setOmniBoxView] = useState('SQL');

  const listOfTabNames = ['SQL', 'Search'];
  const navigationTabs = listOfTabNames.map(tabname => {
    return (
      <button
        key={tabname}
        onClick={() => {
          setOmniBoxView(tabname);
        }}
        omniBoxView={omniBoxView}
        selectedView={tabname}
      >
        {tabname}
      </button>
    );
  });

  // #TODO: Connect this ipc communication with new query input
  const executeQuery = (): void => {
    if (!loadingQueryStatus) {
      setQueryResultError({
        status: false,
        message: ''
      });
      ipcRenderer.send('query-to-main', userInputQuery);
    }
    setLoadingQueryStatus(true);
  };
  const generateInputBox = () => {
    return (
      <OmniBoxInput
        key={omniBoxView}
        userInputForTables={userInputForTables}
        setUserInputForTables={setUserInputForTables}
        omniBoxView={omniBoxView}
        setUserInputQuery={setUserInputQuery}
        userInputQuery={userInputQuery}
        executeQuery={executeQuery}
        loadingQueryStatus={loadingQueryStatus}
      />
    );
  };


  return (
    <OmniBoxWrapper>
      <div>{navigationTabs}</div>
      {generateInputBox()}
      {queryResultError.status && (
        <QueryResultError>{queryResultError.message}</QueryResultError>
      )}
    </OmniBoxWrapper>
  );
};

export default OmniBoxContainer;