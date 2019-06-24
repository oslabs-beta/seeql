import * as React from 'react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';
import { Tabs, Tab, Grommet } from "grommet";
import { grommet } from 'grommet/themes';


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
  background-color: ${props =>
    props.selectedView === props.omniBoxView
      ? 'black'
      : 'black'};
  color: ${(props) =>
    props.selectedView === props.omniBoxView ? 'black' : 'black'};

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

  const listOfTabNames = ['SQL', 'plain'];


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
  const navigationTabs = listOfTabNames.map(tabname => {
    return (
      <Tab
        title={tabname}
      >
        <OmniBoxInput
          tabname={tabname}
          userInputForTables={userInputForTables}
          setUserInputForTables={setUserInputForTables}
          setUserInputQuery={setUserInputQuery}
          userInputQuery={userInputQuery}
          executeQuery={executeQuery}
          loadingQueryStatus={loadingQueryStatus}
        />
      </Tab>
    );
  });

  return (
    <Grommet theme={grommet}>
      <Tabs>{navigationTabs}</Tabs>
      {queryResultError.status && (
        <QueryResultError>{queryResultError.message}</QueryResultError>
      )}
    </Grommet>
  );
};

export default OmniBoxContainer;
