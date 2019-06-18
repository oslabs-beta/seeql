import * as React from 'react';
import {useState, useEffect, useReducer} from 'react';
import * as actions from '../../actions/actions';
import Tables from '../../components/Tables';
import changePinnedStatus from '../../reducers/ChangePinnedStatus';
import styled from 'styled-components';

const TablesWrapper = styled.div`
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

interface ITablesContainerProps {
    data:any;
    userInputForTables: string;
    activeTableInPanel: any;
    selectedForQueryTables: any;
    captureSelectedTable: (any) => any;
    captureQuerySelections: (any) => any;
}

const TablesContainer: React.SFC<ITablesContainerProps> = ({
    userInputForTables,
    activeTableInPanel,
    selectedForQueryTables,
    data,
    captureSelectedTable,
    captureQuerySelections,
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

    if(pinnedTables.length || filteredTables.length){
        return (
          <TablesWrapper>
            {pinnedTables}
            {filteredTables}
          </TablesWrapper>
        )
    } else {
        return (
        <NoSearchResults>
          There were no search results. <br/>Please search again.
        </NoSearchResults>
      )
  }
}

export default TablesContainer;