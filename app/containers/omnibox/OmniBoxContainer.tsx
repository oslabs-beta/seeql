import * as React from 'react';
import styled from 'styled-components';
import OmniBoxInput from '../../components/omnibox/OmniBoxInput';

const OmniBoxWrapper = styled.div`
  box-shadow: 1px 1px 4px #67809f;
  background-color: white;
  padding: 10px;
  border-radius: 3px;
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
      ? '#4B70FE'
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
  pgClient: any,
  userInputQuery: string;
  loadingQueryStatus: boolean;
  queryResultError: any;
  userInputForTables: string;
  omniBoxView: string;
  setQueryResult: (any) => any;
  setOmniBoxView: (any) => any;
  setQueryResultError: (any) => any;
  setLoadingQueryStatus: (any) => any;
  setUserInputQuery: (any) => any;
  setUserInputForTables: (any) => any;
  setActiveDisplayInResultsTab: (any) => any;
}

const OmniBoxContainer: React.SFC<IOmniBoxProps> = ({
  pgClient,
  setQueryResult,
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

  const executeQuery = (): void => {
    if (!loadingQueryStatus) {
      let query = userInputQuery;
      if (query.slice(0, 6).toUpperCase() === 'SELECT') {
        if (query.indexOf(';') > -1) query = query.slice(0, query.indexOf(';'));
        query += ';';

        setQueryResultError({
          status: false,
          message: ''
        });
        pgClient.query(query, (err, result) => {
          if (err) {
            setQueryResult({
              statusCode: 'Syntax Error',
              message: 'Issue getting data from db',
              err
            })
          } else {
            setQueryResult({
              statusCode: 'Success',
              message: result.rows
            })
          }
        })

      } else {
        setQueryResult({
          statusCode: 'Invalid Request',
          message: 'Invalid query input. The query can only be a SELECT statement.'
        });

      }
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