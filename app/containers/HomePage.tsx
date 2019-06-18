import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import * as actions from '../actions/actions';
import changeDisplayOfSidePanel from '../reducers/ChangeDisplayOfSidePanel';
import SidePanel from './SidePanel';
import LoadingComponent from '../components/LoadComponent';
import ResultsContainer from './mainpanel/ResultsContainer';
import OmniBoxContainer from '../containers/omnibox/OmniBoxContainer';

const InvisibleHeader = styled.div`
  height: 30px;
  display: relative;
  -webkit-app-region: drag;
`;

const HomepageWrapper = styled.div`
  display: flex;
  margin-top: -30px;
  font-family: 'Poppins', sans-serif;
`;

const MainPanel = styled.div`
  background-color: #f2f1ef;
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LoadWrap = styled.div`
  display: flex;
  width: 100%;
`;

const HomePage = ({ location }) => {
  const allTablesMetaData = location.state.tables;
  const [selectedForQueryTables, setSelectedForQueryTables] = useState({});
  const [loadingQueryStatus, setLoadingQueryStatus] = useState(false);
  const [activeDisplayInResultsTab, setActiveDisplayInResultsTab] = useState('Tables');
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [userInputForTables, setUserInputForTables] = useState('');
  const [data, setData] = useState([]); //data from database
  const [toggleLoad, setToggleLoad] = useState(true);
  const [userInputQuery, setUserInputQuery] = useState('SELECT * FROM [add a table name here]');
  const [queryResult, setQueryResult] = useState({
    status: 'No query',
    message: []
  });
  const [sidePanelVisibility, setSidePanelVisibility] = useState(true);

  const [activePanel, dispatchSidePanelDisplay] = useReducer(
    changeDisplayOfSidePanel,
    'info'
  );
  const [queryResultError, setQueryResultError] = useState({
    status: false,
    message: ''
  });

  const captureQuerySelections = (e) => {
    let selectedTableName = e.target.dataset.tablename;
    let selectedColumnName = e.target.dataset.columnname;
    let temp = selectedForQueryTables;

    if(Object.keys(temp).includes(selectedTableName)) {
      if(temp[selectedTableName].includes(selectedColumnName)){
        const startIndex = temp[selectedTableName].indexOf(selectedColumnName)
        temp[selectedTableName] = temp[selectedTableName].slice(0, startIndex).concat(temp[selectedTableName].slice(startIndex+1))
        if(temp[selectedTableName].length === 0) delete temp[selectedTableName];
      } else {
        temp[selectedTableName].push(selectedColumnName);
      }
    } else {
      temp[selectedTableName] = [selectedColumnName];
    }


    //for no tables
    if(Object.keys(temp).length === 0){
      setUserInputQuery('SELECT * FROM [add a table name here]')
    }
    //for one table
    if(Object.keys(temp).length === 1) {
      let columns = '';
      for(let table in temp){
        for(let i=0; i < temp[table].length; i++){
          if(i===0) columns += temp[table][i]
          else columns += (', ' + temp[table][i])
        } 
      }
      const query = `SELECT  ` + columns + ` FROM ` + Object.keys(temp)[0];
      setUserInputQuery(query);
    }
    console.log('t', temp)
    setSelectedForQueryTables(temp);
  }
  console.log('a', selectedForQueryTables)

  const togglePanelVisibility = () => {
    if (sidePanelVisibility) setSidePanelVisibility(false);
    else setSidePanelVisibility(true);
  };

  const captureSelectedTable = e => {
    const tablename = e.target.dataset.tablename;
    let selectedPanelInfo;
    let primaryKey;

    data.forEach(table => {
      if (table.table_name === tablename) {
        primaryKey = table.primaryKey;
        selectedPanelInfo = table;
      }
    });

    selectedPanelInfo.foreignKeysOfPrimary = {};

    data.forEach(table => {
      table.foreignKeys.forEach(foreignKey => {
        if (
          foreignKey.foreign_column_name == primaryKey &&
          foreignKey.foreign_table_name == tablename
        ) {
          selectedPanelInfo.foreignKeysOfPrimary[foreignKey.table_name] =
            foreignKey.column_name;
        }
      });
    });
    setActiveTableInPanel(selectedPanelInfo);
    dispatchSidePanelDisplay(actions.changeToInfoPanel());
  };

  //Fetches database information
  useEffect((): void => {
    setToggleLoad(true);
    setData(allTablesMetaData);
    setToggleLoad(false);
  }, [allTablesMetaData]);

  ipcRenderer.removeAllListeners('query-result-to-homepage');
  ipcRenderer.on('query-result-to-homepage', (event, queryResult) => {
    if (queryResult.statusCode === 'Success') {
      setQueryResult({
        status: queryResult.message.length === 0 ? 'No results' : 'Success',
        message: queryResult.message
      });
      setActiveDisplayInResultsTab('Query Results');
    } else if (queryResult.statusCode === 'Invalid Request') {
      setQueryResultError({
        status: true,
        message: queryResult.message
      });
    } else if (queryResult.statusCode === 'Syntax Error') {
      setQueryResultError({
        status: true,
        message: `Syntax error in retrieving query results.
        Error on: ${userInputQuery.slice(
          0,
          parseInt(queryResult.err.position) - 1
        )} "
        ${userInputQuery.slice(
          parseInt(queryResult.err.position) - 1,
          parseInt(queryResult.err.position)
        )} "
        ${userInputQuery.slice(parseInt(queryResult.err.position))};`
      });
    }
    setLoadingQueryStatus(false);
  });

  return (
    <React.Fragment>
      <InvisibleHeader></InvisibleHeader>
      <HomepageWrapper>
        <SidePanel
          activePanel={activePanel}
          dispatchSidePanelDisplay={dispatchSidePanelDisplay}
          activeTableInPanel={activeTableInPanel}
          togglePanelVisibility={togglePanelVisibility}
          sidePanelVisibility={sidePanelVisibility}
        />
        {toggleLoad && (
          <LoadWrap>
            <LoadingComponent />
          </LoadWrap>
        )}
        <MainPanel>
          <OmniBoxContainer 
            userInputForTables={userInputForTables}
            loadingQueryStatus={loadingQueryStatus}
            userInputQuery={userInputQuery}
            setQueryResultError={setQueryResultError}
            setLoadingQueryStatus={setLoadingQueryStatus}
            setUserInputQuery={setUserInputQuery}
            queryResultError={queryResultError}
            setUserInputForTables={setUserInputForTables}
          />
          <ResultsContainer 
            captureQuerySelections={captureQuerySelections}
            captureSelectedTable={captureSelectedTable}
            activeDisplayInResultsTab={activeDisplayInResultsTab}
            queryResult={queryResult}
            data={data}
            userInputForTables={userInputForTables}
            setActiveDisplayInResultsTab={setActiveDisplayInResultsTab}
            activeTableInPanel={activeTableInPanel}
            selectedForQueryTables={selectedForQueryTables}
          />
        </MainPanel>
      </HomepageWrapper>
    </React.Fragment>
  );
};

export default HomePage;
