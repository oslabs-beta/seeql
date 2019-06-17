import * as React from 'react';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';

const OMNIboxInput = styled.textarea`
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
  border: none;
  background-color: #013243;
  transition: 0.2s;
  color: #f2f1ef;
  text-align: center;
  padding: 5px;
  font-size: 80%;

  :hover {
    background-color: #042d36;
  }

  :focus {
    outline: none;
  }
`;

const OMNIBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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

interface IOMNIBoxNavButtonsProps {
    omniBoxView: string;
    selectedView: string;
  }

const OMNIBoxNavButtons = styled.button<IOMNIBoxNavButtonsProps>`
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
    setUserInputForTables
}) => {

  const [omniBoxView, setOmniBoxView] = useState('SQL');
  
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
        <OMNIBoxNavButtons
        onClick={() => {
            setOmniBoxView('SQL');
        }}
        omniBoxView={omniBoxView}
        selectedView="SQL"
        >
        SQL
        </OMNIBoxNavButtons>
        <OMNIBoxNavButtons
        onClick={() => {
            setOmniBoxView('plain');
        }}
        omniBoxView={omniBoxView}
        selectedView="plain"
        >
        PLAIN
        </OMNIBoxNavButtons>
    </OmniBoxNav>
    {omniBoxView === 'SQL' && (
        <OMNIBoxWrapper>
        <OMNIboxInput
            onChange={e => setUserInputQuery(e.target.value)}
            value={userInputQuery}
        ></OMNIboxInput>
        <ExecuteQueryButton
            onClick={executeQuery}
            disabled={loadingQueryStatus}
        >
            {loadingQueryStatus
            ? 'Loading query results...'
            : 'Execute Query'}
        </ExecuteQueryButton>
        </OMNIBoxWrapper>
    )}
    {omniBoxView === 'plain' && (
        <OMNIboxInput
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
        ></OMNIboxInput>
    )}
    {queryResultError.status && (
        <QueryResultError>{queryResultError.message}</QueryResultError>
    )}
    </React.Fragment>
)};


export default OmniBoxContainer;