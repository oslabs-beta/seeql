/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface ICollapseBtnProps {
  sidePanelVisibility: boolean;
}

const CollapseBtn = styled.button<ICollapseBtnProps>`
  border: none;
  border-radius: 3px;
  padding: 5px;
  width: 25px;
  height: 25px;
  margin: 5px;
  display: relative;
  left: 100px;
  margin-left: ${({ sidePanelVisibility }) =>
    sidePanelVisibility ? '0px' : '50px'};
  text-align: center;
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
    background-color: #013243;
    color: white;
  }
`;

const MainPanel = styled.div`
  background-color: #f2f1ef;
  padding: 5px 20px;
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
  const [activeDisplayInResultsTab, setActiveDisplayInResultsTab] = useState(
    'Tables'
  );
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
  const [sidePanelVisibility, setSidePanelVisibility] = useState(true);

  const [activePanel, dispatchSidePanelDisplay] = useReducer(
    changeDisplayOfSidePanel,
    'info'
  );
  const [queryResultError, setQueryResultError] = useState({
    status: false,
    message: ''
  });

  const resetQuerySelection = () => {
    setUserInputQuery('SELECT * FROM [add a table name here]');
    setSelectedForQueryTables({});
  };

  const captureQuerySelections = e => {
    let selectedTableName = e.target.dataset.tablename;
    let selectedColumnName = e.target.dataset.columnname;
    let firstColumn = true;
    let firstTable = true;
    let temp = selectedForQueryTables;
    let columns = '';
    let tables = '';
    let query = '';

    console.log('data is ', data);

    //builds the object used to write the query
    for (let i = 0; i < data.length; i++) {
      if (data[i].table_name === selectedTableName) {
        //builds query selection object
        //check if table already exists in query
        if (Object.keys(temp).includes(selectedTableName)) {
          //check if column name already exists
          if (temp[selectedTableName].columns.includes(selectedColumnName)) {
            //remove the column if it exists
            const startIndex = temp[selectedTableName].columns.indexOf(
              selectedColumnName
            );
            temp[selectedTableName].columns = temp[selectedTableName].columns
              .slice(0, startIndex)
              .concat(temp[selectedTableName].columns.slice(startIndex + 1));
            //add it to the columns
          } else {
            temp[selectedTableName].columns.push(selectedColumnName);
          }
          //check if all items are selected
          if (
            temp[selectedTableName].columns.length ===
            temp[selectedTableName].columncount
          ) {
            temp[selectedTableName].all = true;
          } else {
            temp[selectedTableName].all = false;
          }
          //delete entire object if the columns are now empty
          if (temp[selectedTableName].columns.length === 0)
            //if empty after removing
            delete temp[selectedTableName];
        } else {
          //first row and first table to be selected
          temp[selectedTableName] = {
            all: false,
            columncount: data[i].columns.length,
            columns: [selectedColumnName]
          };
        }
      }
    }

    //actually write the query
    //for no tables
    if (Object.keys(temp).length === 0) {
      query = 'SELECT * FROM [add a table name here]';
    }

    //for one table
    if (Object.keys(temp).length === 1) {
      for (let table in temp) {
        //check if all has been selected
        if (temp[table].all) columns += '*';
        else {
          for (let i = 0; i < temp[table].columns.length; i++) {
            if (firstColumn) {
              columns += temp[table].columns[i];
              firstColumn = false;
            } else columns += ', ' + temp[table].columns[i];
          }
        }
      }
      tables = Object.keys(temp)[0];
      query = `SELECT ` + columns + ` FROM ` + tables;
    }

    //for multiple joins
    if (Object.keys(temp).length === 2) {
      for (let table in temp) {
        //loop through each table
        let tableInitial = table[0] + '.'; //initial of each table
        //check if all the columns have been selected
        if (temp[table].all) {
          if (firstColumn) {
            columns += tableInitial + '*';
            firstColumn = false;
          } else columns += ', ' + tableInitial + '*';
        } else {
          //add each individual column name
          for (let i = 0; i < temp[table].columns.length; i++) {
            if (firstColumn) {
              columns += tableInitial + temp[table].columns[i];
              firstColumn = false;
            } else {
              columns += ', ' + tableInitial + temp[table].columns[i];
            }
          }
        }
        //create the table list
        if (firstTable) {
          tables += table + ` as ` + table[0];
          firstTable = false;
        } else {
          tables += ` INNER JOIN ` + table + ` as ` + table[0];
        }
      }
      //entire query
      query = `SELECT ` + columns + ` FROM ` + tables + ` ON `;
    }

    setUserInputQuery(query);
    setSelectedForQueryTables(temp);
  };

  const togglePanelVisibility = () => {
    if (sidePanelVisibility) {
      setSidePanelVisibility(false);
      setActiveTableInPanel({});
    } else setSidePanelVisibility(true);
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
    setActiveTableInPanel('info');
    setSidePanelVisibility(true);
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
          sidePanelVisibility={sidePanelVisibility}
        />
        {toggleLoad && (
          <LoadWrap>
            <LoadingComponent />
          </LoadWrap>
        )}
        <MainPanel>
          <CollapseBtn
            onClick={togglePanelVisibility}
            data-active={activePanel}
            sidePanelVisibility={sidePanelVisibility}
          >
            {' '}
            {sidePanelVisibility ? `<<` : `>>`}{' '}
          </CollapseBtn>
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
            resetQuerySelection={resetQuerySelection}
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
