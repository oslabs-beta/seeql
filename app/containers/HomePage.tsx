import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { Button, Collapsible, Grommet, Text } from 'grommet';
import { grommet } from 'grommet/themes';
import { FormPrevious, FormNext } from "grommet-icons";
import * as actions from '../actions/actions';
import changeDisplayOfSidePanel from '../reducers/ChangeDisplayOfSidePanel';
import SidePanel from './SidePanel';
import LoadingComponent from '../components/LoadComponent';
import ResultsContainer from './mainpanel/ResultsContainer';
import OmniBoxContainer from '../containers/omnibox/OmniBoxContainer';


const InvisibleHeader = styled.div`
  height: 40px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F7F9FD;
  -webkit-app-region: drag;
   transition: all 0.2s ease-in-out;
`;

const SRightHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 5px;
  cursor: pointer;
`

const SHomepageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

interface ISRightPanelProps {
  sidePanelVisibility: boolean;
}

const SMainPanelWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
   transition: all 0.2s ease-in-out;
`

//REPLACE MAIn
const SLeftPanelWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 10px 15px 15px;
  background-color: #E6EAF2;
   transition: all 0.2s ease-in-out;
`

const SRightPanelWrapper = styled.div<ISRightPanelProps>`
  height: 100%;
    width: ${({ sidePanelVisibility }) => sidePanelVisibility ? '250px' : '0px'};
    transition: all 0.2s ease-in-out;
`

const LoadWrap = styled.div`
  display: flex;
`;

let relationships = {};
const alias = {};

const HomePage = ({ location }) => {
  const allTablesMetaData = location.state.tables;
  // const [relationships, setRelationships]

  const [selectedForQueryTables, setSelectedForQueryTables] = useState({});
  const [loadingQueryStatus, setLoadingQueryStatus] = useState(false);
  const [activeDisplayInResultsTab, setActiveDisplayInResultsTab] = useState(
    'Tables'
  );
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [userInputForTables, setUserInputForTables] = useState('');
  const [data, setData] = useState([]); // data from database
  const [toggleLoad, setToggleLoad] = useState(true);
  const [userInputQuery, setUserInputQuery] = useState(
    'SELECT * FROM [table name]'
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
    relationships = {};
    setUserInputQuery('SELECT * FROM [table name]');
    setSelectedForQueryTables({});
    setQueryResultError({
      status: false,
      message: ''
    });
  };

  // Track user inactivity, logout after 15 minutes
  const [inactiveTime, setInactiveTime] = useState(0);
  const [intervalId, captureIntervalId] = useState();
  const [redirectDueToInactivity, setRedirectDueToInactivity] = useState(false);

  const logOut = () => {
    clearInterval(intervalId);
    ipcRenderer.send('logout-to-main', 'inactivity');
    setRedirectDueToInactivity(true);
    clearInterval(intervalId);
  }

  useEffect(() => {
    captureIntervalId(setInterval(() => setInactiveTime(inactiveTime => inactiveTime + 1), 60000));
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => { if (inactiveTime >= 15) logOut() }, [inactiveTime]);


  const captureQuerySelections = e => {
    const selectedTableName = e.target.dataset.tablename;
    const selectedColumnName = e.target.dataset.columnname;
    let firstColumn = true;
    let firstTable = true;
    let pk = '';
    const temp = selectedForQueryTables;
    let columns = '';
    let tables = '';
    let query = '';
    relationships[selectedTableName] = [];

    // get relationships of FK
    data.forEach(table => {
      if (table.table_name === selectedTableName) {
        pk = table.primaryKey;
        table.foreignKeys.forEach(foreignkey => {
          relationships[selectedTableName].push({
            tablename: foreignkey.table_name,
            colname: foreignkey.column_name,
            fktablename: foreignkey.foreign_table_name,
            fkcolname: foreignkey.foreign_column_name
          });
        });
      }
    });

    // get relationships of PK
    data.forEach(table => {
      table.foreignKeys.forEach(foreignkey => {
        if (
          foreignkey.foreign_column_name == pk &&
          foreignkey.foreign_table_name == selectedTableName
        ) {
          relationships[selectedTableName].push({
            tablename: foreignkey.foreign_table_name,
            colname: foreignkey.foreign_column_name,
            fktablename: foreignkey.table_name,
            fkcolname: foreignkey.column_name
          });
        }
      });
    });

    // builds the object used to write the query
    for (let i = 0; i < data.length; i++) {
      if (data[i].table_name === selectedTableName) {
        // builds query selection object
        // check if table already exists in query
        if (Object.keys(temp).includes(selectedTableName)) {
          // check if column name already exists
          if (temp[selectedTableName].columns.includes(selectedColumnName)) {
            // remove the column if it exists
            const startIndex = temp[selectedTableName].columns.indexOf(
              selectedColumnName
            );
            temp[selectedTableName].columns = temp[selectedTableName].columns
              .slice(0, startIndex)
              .concat(temp[selectedTableName].columns.slice(startIndex + 1));
            // add it to the columns
          } else {
            temp[selectedTableName].columns.push(selectedColumnName);
          }
          // check if all items are selected
          if (
            temp[selectedTableName].columns.length ===
            temp[selectedTableName].columncount
          ) {
            temp[selectedTableName].all = true;
          } else {
            temp[selectedTableName].all = false;
          }
          // delete entire object if the columns are now empty
          if (temp[selectedTableName].columns.length === 0) {
            // if empty after removing
            delete temp[selectedTableName];
            delete relationships[selectedTableName];
            delete alias[selectedTableName];
          }
        } else {
          // first row and first table to be selected
          temp[selectedTableName] = {
            all: false,
            columncount: data[i].columns.length,
            columns: [selectedColumnName]
          };
        }
      }
    }

    // query generation
    // for no tables
    if (Object.keys(temp).length === 0) {
      query = 'SELECT * FROM[table name]';
    }

    // for one table
    if (Object.keys(temp).length === 1) {
      for (const table in temp) {
        // check if all has been selected
        if (temp[table].all) columns += '*';
        else {
          for (let i = 0; i < temp[table].columns.length; i++) {
            if (firstColumn) {
              columns += temp[table].columns[i];
              firstColumn = false;
            } else columns += `, ${temp[table].columns[i]}`;
          }
        }
      }
      tables = Object.keys(temp)[0];
      query = `SELECT ${columns} FROM ${tables}`;
    }

    let previousTablePointer;

    // for multiple joins
    if (Object.keys(temp).length === 2) {
      for (const table in temp) {
        // loop through each table
        let aliasIndex = 0;
        let tableInitial = table[0];
        while (Object.values(alias).includes(table[aliasIndex])) {
          tableInitial += table[aliasIndex + 1];
          aliasIndex++; // initial of each table
        }
        alias[table] = tableInitial;
        tableInitial += '.';
        // check if all the columns have been selected
        if (temp[table].all) {
          if (firstColumn) {
            columns += `${tableInitial}*`;
            firstColumn = false;
          } else columns += `, ${tableInitial}*`;
        } else {
          // add each individual column name
          for (let i = 0; i < temp[table].columns.length; i++) {
            if (firstColumn) {
              columns += tableInitial + temp[table].columns[i];
              firstColumn = false;
            } else {
              columns += `, ${tableInitial}${temp[table].columns[i]}`;
            }
          }
        }

        // create the table name
        if (firstTable) {
          tables += `${table} as ${table[0]}`;
          firstTable = false;
        } else {
          tables += ` INNER JOIN ${table} as ${alias[table]}`;
          let rel = '';
          relationships[table].forEach(relation => {
            if (
              relation.fktablename === previousTablePointer &&
              relation.tablename === table
            ) {
              rel =
                `${alias[previousTablePointer]
                }.${
                relation.fkcolname
                }=${
                tableInitial + relation.colname}`;
            }
          });
          tables += ` ON ${rel}`;
        }
        previousTablePointer = table;
      }

      // final query
      query = `SELECT ${columns} FROM ${tables}`;
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
    const { tablename } = e.target.dataset;
    let selectedPanelInfo = {};
    let primaryKey;

    data.forEach(table => {
      if (table.table_name === tablename) {
        primaryKey = table.primaryKey;
        selectedPanelInfo = table;
      }
    });

    selectedPanelInfo['foreignKeysOfPrimary'] = {};

    data.forEach(table => {
      table.foreignKeys.forEach(foreignKey => {
        if (
          foreignKey.foreign_column_name == primaryKey &&
          foreignKey.foreign_table_name == tablename
        ) {
          selectedPanelInfo['foreignKeysOfPrimary'][foreignKey.table_name] =
            foreignKey.column_name;
        }
      });
    });
    setActiveTableInPanel('info');
    setSidePanelVisibility(true);
    setActiveTableInPanel(selectedPanelInfo);
    dispatchSidePanelDisplay(actions.changeToInfoPanel());
  };

  // Fetches database information
  useEffect((): void => {
    setToggleLoad(true);
    setData(allTablesMetaData);
    setToggleLoad(false);
  }, [allTablesMetaData]);

  useEffect(() => {
    ipcRenderer.on('query-result-to-homepage', (_event, queryResult) => {
      if (queryResult.statusCode === 'Success') {
        setQueryResult({
          status: queryResult.message.length === 0 ? 'No results' : 'Success',
          message: queryResult.message
        });
        setActiveDisplayInResultsTab('Query Results');
      }
      if (queryResult.statusCode === 'Invalid Request') {
        setQueryResultError({
          status: true,
          message: queryResult.message
        });
      }
      if (queryResult.statusCode === 'Syntax Error') {
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
    return () => ipcRenderer.removeAllListeners('query-result-to-homepage');
  }, [userInputQuery]);


  return (

    <Grommet theme={grommet}>
      {redirectDueToInactivity && <Redirect to='/' />}
      <SHomepageWrapper onMouseMove={() => setInactiveTime(0)}>
        <InvisibleHeader>
          <div></div>
          <SRightHeaderWrapper onClick={togglePanelVisibility}>
            <Text style={{ cursor: 'pointer' }}> Menu</Text>
            <Button
              plain={true}
              fill={false}
              alignSelf="start"
              margin="5px 0px"
              style={{ cursor: 'pointer' }}
              icon={sidePanelVisibility ? <FormNext size="medium" /> : <FormPrevious size="medium" />}
            />
          </SRightHeaderWrapper>
        </InvisibleHeader>
        {toggleLoad && (
          <LoadWrap>
            <LoadingComponent />
          </LoadWrap>
        )}
        <SMainPanelWrapper className="main">
          <SLeftPanelWrapper className="left">
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
              relationships={relationships}
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
          </SLeftPanelWrapper>
          <SRightPanelWrapper className="right" sidePanelVisibility={sidePanelVisibility}>
            {/* <Collapsible open={sidePanelVisibility} direction="horizontal" className="collapsible" style={{ height: "100%" }}> */}
            <SidePanel
              intervalId={intervalId}
              activePanel={activePanel}
              dispatchSidePanelDisplay={dispatchSidePanelDisplay}
              activeTableInPanel={activeTableInPanel}
              sidePanelVisibility={sidePanelVisibility}
            />
            {/* </Collapsible> */}
          </SRightPanelWrapper>
        </SMainPanelWrapper>
      </SHomepageWrapper>
    </Grommet >

  );
};

export default HomePage;
