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
  const [selectedForQueryTables, setSelectedForQueryTables] = useState([]);
  const [loadingQueryStatus, setLoadingQueryStatus] = useState(false);
  const [activeDisplayInResultsTab, setActiveDisplayInResultsTab] = useState('tables');
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [userInputForTables, setUserInputForTables] = useState('');
  const [data, setData] = useState([]); //data from database
  const [toggleLoad, setToggleLoad] = useState(true);
  const [userInputQuery, setUserInputQuery] = useState(
    'SELECT * FROM [add a table name here]'
  );
  const [queryResult, setQueryResult] = useState({
    status: 'No query',
    message: []
  });
  const [visible, setVisible] = useState(true);

  const [activePanel, dispatchSidePanelDisplay] = useReducer(
    changeDisplayOfSidePanel,
    'info'
  );
  const [queryResultError, setQueryResultError] = useState({
    status: false,
    message: ''
  });

  const captureQuerySelections = (e) => {
    let temp = selectedForQueryTables;
    let adding = true;
    for(let i=0; i < selectedForQueryTables.length; i++){
      if((selectedForQueryTables[i].tablename === e.target.dataset.tablename) && (selectedForQueryTables[i].columnname === e.target.dataset.columnname)) {
        temp = selectedForQueryTables.slice(0, i).concat(selectedForQueryTables.slice(i+1))
        adding = false;
        break;
      }
    }
    if(adding){
      temp.push({
        tablename: e.target.dataset.tablename,
        columnname: e.target.dataset.columnname
      })
    }
    setSelectedForQueryTables(temp);
  }

  const togglePanelVisibility = () => {
    if (visible) setVisible(false);
    else setVisible(true);
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
      setActiveDisplayInResultsTab('queryresults');
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
          visible={visible}
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
