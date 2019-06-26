import * as React from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';
import { Tabs, Tab, Grommet, Box } from "grommet";
import { grommet } from 'grommet/themes';
import { Search } from 'grommet-icons';

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

  const listOfTabNames = ['SQL', 'Search'];


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
        title={tabname === 'Search' ? <Search style={{ height: '20px' }} /> : tabname}
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
    <Grommet theme={grommet} className="OmniGrommet" style={{ height: 'auto' }}>
      <OmniBoxWrapper>
        <Tabs>{navigationTabs}</Tabs>
        {queryResultError.status && (
          <QueryResultError>{queryResultError.message}</QueryResultError>
        )}
      </OmniBoxWrapper>
    </Grommet>
  );
};

export default OmniBoxContainer;
