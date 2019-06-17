import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import * as actions from '../../actions/actions';
import styled from 'styled-components';
import QueryResults from "../../components/QueryResults";
import Tables from '../../components/Tables';
import changePinnedStatus from '../../reducers/ChangePinnedStatus';

const MainPanelNav = styled.nav`
  display: flex;
  justify-content: center;
  align-self: flex-start;
`;

interface IMainPanelNavButtonProps {
    activeDisplayInResultsTab: string;
    activetabname: string;
  }
  
  const MainPanelNavButton = styled.button<IMainPanelNavButtonProps>`
    font-family: 'Poppins', sans-serif;
    border: none;
    border-bottom: ${({ activeDisplayInResultsTab, activetabname }) =>
      activeDisplayInResultsTab === activetabname
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

const TablesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid black;
  overflow: scroll;
  height: 60vh;
`;

const NoSearchResults = styled.div`
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

interface IForeignKey {
    table: string;
    column: string;
  }

let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

interface IResultsContainerProps {
    activeDisplayInResultsTab: string;
    queryResult:any;
    data:any;
    userInputForTables: string;
    activeTableInPanel: any;
    selectedForQueryTables: any;
    captureQuerySelections: (any) => any;
    captureSelectedTable: (any) => any;
    setActiveDisplayInResultsTab: (any) => any;
}

const ResultsContainer: React.SFC<IResultsContainerProps> = ({
    activeDisplayInResultsTab,
    queryResult,
    userInputForTables,
    activeTableInPanel,
    selectedForQueryTables,
    data,
    captureSelectedTable,
    captureQuerySelections,
    setActiveDisplayInResultsTab
}) => {
    const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
    const [filteredTables, setFilteredTables] = useState([]);
    const [pinnedTables, setPinnedTables] = useState([]);
    const [pinnedTableNames, dispatchPinned] = useReducer(changePinnedStatus, []);
    const [foreignKeysAffected, setForeignKeysAffected] = useState([]);
    const [primaryKeyAffected, setPrimaryKeyAffected] = useState([
      {
        primaryKeyTable: '',
        primaryKeyColumn: ''
      }
    ]);
    
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
  

    return (
        <React.Fragment>
             <MainPanelNav>
              <MainPanelNavButton
                activeDisplayInResultsTab={activeDisplayInResultsTab}
                activetabname="tables"
                onClick={() => setActiveDisplayInResultsTab("tables")}
              >
                Tables
              </MainPanelNavButton>
              <MainPanelNavButton
                activeDisplayInResultsTab={activeDisplayInResultsTab}
                activetabname="queryresults"
                onClick={() => setActiveDisplayInResultsTab("queryresults")}
              >
                Query Results
              </MainPanelNavButton>
            </MainPanelNav>
            {activeDisplayInResultsTab === 'tables' &&
              (pinnedTables.length || filteredTables.length ? (
                <TablesContainer>
                  {pinnedTables}
                  {filteredTables}
                </TablesContainer>
              ) : (
                <NoSearchResults>
                  There were no search results. <br/>Please search again.
                </NoSearchResults>
              ))}
            {activeDisplayInResultsTab === 'queryresults' && (
              <QueryResults queryResult={queryResult} />
            )}
        </React.Fragment>
    )
}

export default ResultsContainer;