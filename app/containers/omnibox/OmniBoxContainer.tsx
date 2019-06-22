import * as React from 'react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';

const OmniBoxNav = styled.nav`
  display: flex;
  margin: 0px 5px;
`;

const OmniBoxWrapper = styled.div`
margin: 20px;
`

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
  width: 50%;
  font-family: 'Poppins', sans-serif;
  border-radius: 3px 3px 0px 0px;
  border: none;
  background-color: ${props =>
    props.selectedView === props.omniBoxView
      ? props.theme.omniBox.buttonColorActive
      : props.theme.omniBox.buttonColor};
  color: ${(props) =>
    props.selectedView === props.omniBoxView ? props.theme.omniBox.fontColorActive : props.theme.omniBox.fontColor};
  font-weight: ${(props) =>
    props.selectedView === props.omniBoxView ? 'bold' : 'none'};

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
  const navigationTabs = listOfTabNames.map(tabname => {
    return (
      <OmniBoxNavButton
        key={tabname}
        onClick={() => {
          setOmniBoxView(tabname);
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
      <OmniBoxNav>{navigationTabs}</OmniBoxNav>
      {generateInputBox()}
      {queryResultError.status && (
        <QueryResultError>{queryResultError.message}</QueryResultError>
      )}
    </OmniBoxWrapper>
  );
};

export default OmniBoxContainer;
