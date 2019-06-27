import * as React from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';

const OmniBoxWrapper = styled.div`
  box-shadow: 1px 1px 4px #67809f;
  background-color: white;
  padding: 10px;
  border-radius: 3px;
`

const QueryResultError = styled.div`
  font-family: 'Poppins';
  color: #ca333e;
  border-radius: 3px;
  border-left: 3px solid #ca333e;
  font-size: 80%;
  background-color: #f1c7ca;
  margin: 5px 0px;
  padding: 5px;
`;
interface IOmniBoxNavButtonProps {
  omniBoxView: string;
  selectedView: string;
}

const OmniBoxNavButton = styled.button<IOmniBoxNavButtonProps>`
  padding: 5px;
  width: 50%;
  font-size: 80%;
  font-family: 'Poppins', sans-serif;
  border-radius: 3px 3px 0px 0px;
  border: none;
      cursor: pointer;
  color: ${props =>
    props.selectedView === props.omniBoxView
      ? '#e26a6a'
      : 'grey'};
  font-weight: ${(props) =>
    props.selectedView === props.omniBoxView ? 'bold' : 'none'};
  :hover{
    font-weight: bold;
  }
  :focus {
    outline: none;
  }
`;

interface IOmniBoxProps {
  userInputQuery: string;
  loadingQueryStatus: boolean;
  queryResultError: any;
  userInputForTables: string;
  omniBoxView: string;
  setOmniBoxView: (any) => any;
  setQueryResultError: (any) => any;
  setLoadingQueryStatus: (any) => any;
  setUserInputQuery: (any) => any;
  setUserInputForTables: (any) => any;
  setActiveDisplayInResultsTab: (any) => any;
}

const OmniBoxContainer: React.SFC<IOmniBoxProps> = ({
  userInputQuery,
  loadingQueryStatus,
  setQueryResultError,
  setLoadingQueryStatus,
  setUserInputQuery,
  queryResultError,
  setUserInputForTables,
  userInputForTables,
  omniBoxView,
  setOmniBoxView,
  setActiveDisplayInResultsTab
}) => {

  const listOfTabNames = ['SQL', 'Search'];
  const navigationTabs = listOfTabNames.map(tabname => {
    return (
      <OmniBoxNavButton
        key={tabname}
        onClick={() => {
          setOmniBoxView(tabname);
          if (tabname === 'Search') setActiveDisplayInResultsTab('Tables');
        }}
        omniBoxView={omniBoxView}
        selectedView={tabname}
      >
        {tabname}
      </OmniBoxNavButton>
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
      <nav>{navigationTabs}</nav>
      {generateInputBox()}
      {queryResultError.status && (
        <QueryResultError>{queryResultError.message}</QueryResultError>
      )}
    </OmniBoxWrapper>
  );
};

export default OmniBoxContainer;