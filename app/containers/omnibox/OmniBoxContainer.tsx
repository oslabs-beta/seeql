import * as React from 'react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';

const OmniBoxNav = styled.nav`
  display: flex;
`;

const QueryResultError = styled.div`
  background-color: #f1c7ca;
  color: #ca333e;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
  font-family: 'Poppins', sans-serif;
  border-left: 3px solid #ca333e;
  font-size: 80%;
`;

interface IOmniBoxNavButtonProps {
    omniBoxView: string;
    selectedView: string;
  }

const OmniBoxNavButton = styled.button<IOmniBoxNavButtonProps>`
  padding: 5px;
  font-family: 'Poppins', sans-serif;
  border-radius: 3px 3px 0px 0px;
  border: none;
  background-color: ${({ omniBoxView, selectedView }) =>
    selectedView === omniBoxView ? '#3C1642' : 'transparent'};
  color: ${({ omniBoxView, selectedView }) =>
    selectedView === omniBoxView ? 'white' : 'black'};

  :focus {
    outline: none;
  }
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

const OmniBoxContainer: React.SFC<IOmniBoxProps>= ({
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

  const listOfTabNames = ['SQL', 'plain']
  const navigationTabs = listOfTabNames.map((tabname) => {
    return <OmniBoxNavButton 
    key={tabname}
    onClick={() => {
        setOmniBoxView(tabname)}} omniBoxView={omniBoxView} selectedView={tabname}>{tabname}</OmniBoxNavButton>
  })

  const generateInputBox = () => {
      return (<OmniBoxInput 
                key={omniBoxView}
                userInputForTables={userInputForTables}
                setUserInputForTables={setUserInputForTables}
                omniBoxView={omniBoxView}
                setUserInputQuery={setUserInputQuery}
                userInputQuery={userInputQuery}
                executeQuery={executeQuery}
                loadingQueryStatus={loadingQueryStatus} />);
  }

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

  return(
    <React.Fragment>
        <OmniBoxNav>
            {navigationTabs}
        </OmniBoxNav>
        {generateInputBox()}
        {queryResultError.status && 
            <QueryResultError>{queryResultError.message}</QueryResultError>
        }
    </React.Fragment>
)};

export default OmniBoxContainer;