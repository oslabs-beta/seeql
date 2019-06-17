import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import * as actions from '../actions/actions';
import changePinnedStatus from '../reducers/ChangePinnedStatus';
import changeDisplayOfLeftPanel from '../reducers/ChangeDisplayOfLeftPanel';
import Tables from '../components/Tables';
import LeftPanel from './Panel';
import LoadingComponent from '../components/LoadComponent';
import QueryResults from "../components/QueryResults";

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

const RightPanel = styled.div`
  background-color: #f2f1ef;
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const OMNIBoxContainer = styled.div``;

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
const OmniBoxNav = styled.nav`
  display: flex;
`;
const BottomPanelNav = styled.nav`
  display: flex;
  justify-content: center;
  align-self: flex-start;
`;

interface IBottomPanelNavButtonProps {
  activeDisplayInBottomTab: string;
  activetabname: string;
}

const BottomPanelNavButton = styled.button<IBottomPanelNavButtonProps>`
  font-family: 'Poppins', sans-serif;
  border: none;
  border-bottom: ${({ activeDisplayInBottomTab, activetabname }) =>
    activeDisplayInBottomTab === activetabname
      ? '3px solid #013243'
      : '3px solid transparent'};
  padding: 8px;
  transition: 0.3s;
  font-size: 80%;
  background-color: transparent;
  :focus {
    outline: none;
  }
  :hover {
    border-bottom: 3px solid black;
  }
`;

const BottomPanelContainer = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const TablesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid black;
  overflow: scroll;
  height: 60vh;
`;
const EmptyState = styled.div`
  padding: 20px;
`;

const NormalTableWrapper = styled.div`
  margin: 10px;
`;

const PinnedTableWrapper = styled.div`
  margin: 10px;
`;

interface IPinButtonProps {
  pinned: boolean;
}

const PinBtn = styled.button<IPinButtonProps>`
  border: none;
  background-color: ${props => (props.pinned ? 'rgb(93, 0, 250)' : 'white')};
  color: ${props => (props.pinned ? 'white' : 'black')};
  padding: 5px;
  border-radius: 3px;

  :hover {
    font-weight: bold;
    color: #00b5cc;
  }
  :focus {
    outline: none;
  }
`;

const LoadWrap = styled.div`
  display: flex;
  width: 100%;
`;

interface IForeignKey {
  table: string;
  column: string;
}

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

let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

const HomePage = ({ location }) => {
  const allTablesMetaData = location.state.tables;
  const [selectedForQueryTables, setSelectedForQueryTables] = useState([]);
  const [loadingQueryStatus, setLoadingQueryStatus] = useState(false);
  const [activeDisplayInBottomTab, setActiveDisplayInBottomTab] = useState(
    'tables'
  );
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [filteredTables, setFilteredTables] = useState([]);
  const [userInputForTables, setUserInputForTables] = useState('');
  const [data, setData] = useState([]); //data from database
  const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
  const [toggleLoad, setToggleLoad] = useState(true);
  const [foreignKeysAffected, setForeignKeysAffected] = useState([]);
  const [primaryKeyAffected, setPrimaryKeyAffected] = useState([
    {
      primaryKeyTable: '',
      primaryKeyColumn: ''
    }
  ]);
  const [pinnedTables, setPinnedTables] = useState([]);
  const [omniBoxView, setOmniBoxView] = useState('SQL');
  const [userInputQuery, setUserInputQuery] = useState(
    'SELECT * FROM [add a table name here]'
  );
  const [queryResult, setQueryResult] = useState({
    status: 'No query',
    message: []
  });
  const [visible, setVisible] = useState(true);

  const captureQuerySelections = (e) => {
    let temp = selectedForQueryTables;
    let adding = true;
    for(let i=0; i < selectedForQueryTables.length; i++){
      if((selectedForQueryTables[i].tablename === e.target.dataset.tablename) && (selectedForQueryTables[i].columnname === e.target.dataset.columnname)) {
        console.log('hi', selectedForQueryTables[i].tablename, e.target.dataset.tablename)
        temp = selectedForQueryTables.slice(0, i).concat(selectedForQueryTables.slice(i+1))
        console.log('temp ', temp)
        adding = false;
        break;
      }
    }
    if(adding){
      console.log('adding :)')
      temp.push({
        tablename: e.target.dataset.tablename,
        columnname: e.target.dataset.columnname
      })
    }
    console.log('temp ', temp)
    setSelectedForQueryTables(temp);
  }

  const togglePanelVisibility = () => {
    if (visible) setVisible(false);
    else setVisible(true);
  };

  const [pinnedTableNames, dispatchPinned] = useReducer(changePinnedStatus, []);
  const [activePanel, dispatchLeftPanelDisplay] = useReducer(
    changeDisplayOfLeftPanel,
    'search'
  );
  const [queryResultError, setQueryResultError] = useState({
    status: false,
    message: ''
  });
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
    dispatchLeftPanelDisplay(actions.changeToInfoPanel());
  };

  useEffect(() => {
    if (!mouseOver) {
      //Resets all relationships
      setPrimaryKeyAffected([{ primaryKeyTable: '', primaryKeyColumn: '' }]);
      setForeignKeysAffected([]);
    }

    //Determines which rows should be highlighted
    if (mouseOver) {
      if (isForeignKey == 'true') {
        setPrimaryKeyAffected([
          {
            primaryKeyTable: primaryKeyTableForForeignKey,
            primaryKeyColumn: primaryKeyColumn
          }
        ]);
      }

      if (isPrimaryKey === 'true') {
        const allForeignKeys: IForeignKey[] = [];
        data.forEach((table): void => {
          table.foreignKeys.forEach((foreignkey): void => {
            if (
              foreignkey.foreign_table_name === selectedTableName &&
              foreignkey.foreign_column_name === selectedColumnName
            )
              allForeignKeys.push({
                table: foreignkey.table_name,
                column: foreignkey.column_name
              });
          });
        });
        setForeignKeysAffected(allForeignKeys);
      }
    }
  }, [data, mouseOver]);

  //Fetches database information
  useEffect((): void => {
    setToggleLoad(true);
    setData(allTablesMetaData);
    setToggleLoad(false);
  }, [allTablesMetaData]);

  //Builds out tables to display
  useEffect((): void => {
    const pinned = [];
    const filtered = [];

    if (data.length > 0) {
      const regex = new RegExp(userInputForTables);
      data.forEach(table => {
        if (pinnedTableNames.includes(table.table_name)) {
          pinned.push(
            <PinnedTableWrapper>
              <PinBtn
                data-pinned={table.table_name}
                onClick={() =>
                  dispatchPinned(actions.removeFromPinned(table.table_name))
                }
                pinned={true}
              >
                UNPIN
              </PinBtn>
              <Tables
                selectedForQueryTables={selectedForQueryTables}
                captureQuerySelections={captureQuerySelections}
                activeTableInPanel={activeTableInPanel}
                tableName={table.table_name}
                columns={table.columns}
                primarykey={table.primaryKey}
                foreignkeys={table.foreignKeys}
                primaryKeyAffected={primaryKeyAffected}
                foreignKeysAffected={foreignKeysAffected}
                captureSelectedTable={captureSelectedTable}
                captureMouseEnter={e => {
                  isPrimaryKey = e.target.dataset.isprimarykey;
                  isForeignKey = e.target.dataset.isforeignkey;
                  primaryKeyTableForForeignKey =
                    e.target.dataset.foreignkeytable;
                  primaryKeyColumn = e.target.dataset.foreignkeycolumn;
                  selectedTableName = e.target.dataset.tablename;
                  selectedColumnName = e.target.dataset.columnname;
                  setMouseOver(true);
                }}
                captureMouseExit={() => {
                  setMouseOver(false);
                }}
                key={table.table_name}
              />
            </PinnedTableWrapper>
          );
        } else if (regex.test(table.table_name)) {
          filtered.push(
            <NormalTableWrapper>
              <PinBtn
                data-pinned={table.table_name}
                onClick={() =>
                  dispatchPinned(actions.addToPinned(table.table_name))
                }
                pinned={false}
              >
                PIN
              </PinBtn>
              <Tables
                selectedForQueryTables={selectedForQueryTables}
                captureQuerySelections={captureQuerySelections}
                activeTableInPanel={activeTableInPanel}
                tableName={table.table_name}
                columns={table.columns}
                primarykey={table.primaryKey}
                foreignkeys={table.foreignKeys}
                primaryKeyAffected={primaryKeyAffected}
                foreignKeysAffected={foreignKeysAffected}
                captureSelectedTable={captureSelectedTable}
                captureMouseEnter={e => {
                  isPrimaryKey = e.target.dataset.isprimarykey;
                  isForeignKey = e.target.dataset.isforeignkey;
                  primaryKeyTableForForeignKey =
                    e.target.dataset.foreignkeytable;
                  primaryKeyColumn = e.target.dataset.foreignkeycolumn;
                  selectedTableName = e.target.dataset.tablename;
                  selectedColumnName = e.target.dataset.columnname;
                  setMouseOver(true);
                }}
                captureMouseExit={() => {
                  setMouseOver(false);
                }}
                key={table.table_name}
              />
            </NormalTableWrapper>
          );
        }
      });
      setFilteredTables(filtered);
      setPinnedTables(pinned);
    }
  }, [
    data,
    foreignKeysAffected,
    primaryKeyAffected,
    userInputForTables,
    pinnedTableNames,
    activeTableInPanel,
    selectedForQueryTables
  ]);

  const activeTabcapture = (e): void => {
    setActiveDisplayInBottomTab(e.target.dataset.activetabname);
    if (e.target.dataset.activetabname === 'plain') setUserInputQuery('');
    if (e.target.dataset.activetabname === 'SQL') {
      setUserInputForTables('')
    };
  };

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

  ipcRenderer.removeAllListeners('query-result-to-homepage');
  ipcRenderer.on('query-result-to-homepage', (event, queryResult) => {
    if (queryResult.statusCode === 'Success') {
      setQueryResult({
        status: queryResult.message.length === 0 ? 'No results' : 'Success',
        message: queryResult.message
      });
      setActiveDisplayInBottomTab('queryresults');
    } else if (queryResult.statusCode === 'Invalid Request') {
      setQueryResultError({
        status: true,
        message: queryResult.message
      });
    } else if (queryResult.statusCode === 'Syntax Error') {
      setQueryResultError({
        status: true,
        message: `Syntax error in retrieving query results. 
        Error on: [${userInputQuery.slice(
          0,
          parseInt(queryResult.err.position) - 1
        )} "
        ${userInputQuery.slice(
          parseInt(queryResult.err.position) - 1,
          parseInt(queryResult.err.position)
        )} "
        ${userInputQuery.slice(parseInt(queryResult.err.position))};]`
      });
    }
    setLoadingQueryStatus(false);
  });

  return (
    <React.Fragment>
      <InvisibleHeader></InvisibleHeader>
      <HomepageWrapper className="homepage">
        <LeftPanel
          activePanel={activePanel}
          dispatchLeftPanelDisplay={dispatchLeftPanelDisplay}
          activeTableInPanel={activeTableInPanel}
          togglePanelVisibility={togglePanelVisibility}
          visible={visible}
        />
        {toggleLoad && (
          <LoadWrap>
            <LoadingComponent />
          </LoadWrap>
        )}
        <RightPanel>
          <OMNIBoxContainer>
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
          </OMNIBoxContainer>
          <BottomPanelContainer>
            <BottomPanelNav>
              <BottomPanelNavButton
                activeDisplayInBottomTab={activeDisplayInBottomTab}
                activetabname="tables"
                data-activetabname="tables"
                onClick={activeTabcapture}
              >
                Tables
              </BottomPanelNavButton>
              <BottomPanelNavButton
                activeDisplayInBottomTab={activeDisplayInBottomTab}
                activetabname="queryresults"
                data-activetabname="queryresults"
                onClick={activeTabcapture}
              >
                Query Results
              </BottomPanelNavButton>
            </BottomPanelNav>
            {activeDisplayInBottomTab === 'tables' &&
              (pinnedTables.length || filteredTables.length ? (
                <TablesContainer>
                  {pinnedTables}
                  {filteredTables}
                </TablesContainer>
              ) : (
                <EmptyState>
                  There were no search results. Please search again.
                </EmptyState>
              ))}
            {activeDisplayInBottomTab === 'queryresults' && (
              <QueryResults queryResult={queryResult} />
            )}
          </BottomPanelContainer>
        </RightPanel>
      </HomepageWrapper>
    </React.Fragment>
  );
};

export default HomePage;
