import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import * as actions from '../../actions/actions';
import Tables from '../../components/mainpanel/Tables';
import changePinnedStatus from '../../reducers/ChangePinnedStatus';
import styled from 'styled-components';

interface ITableWrapperProps {
  highlightForRelationship: string;
}

const TablesWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid black;
  overflow: scroll;
  height: 60vh;
`;

const IndTableNav = styled.div`
  display: flex;
  justify-content: space-around;
`

const ViewInfoButton = styled.button`
  border: none;
  background-color: transparent;
  transform: 0.3s;

  :hover {
    color: ${props => props.theme.tables.infoButton};
    font-weight: bold;
  }
  :focus {
    outline: none;
  }
`

const NoSearchResults = styled.div`
  padding: 20px;
`;

const TableWrapper = styled.div<ITableWrapperProps>`
  margin: 10px;
  box-shadow: 2px 2px 8px lightgrey;
  border: ${({ highlightForRelationship }) => (highlightForRelationship == 'true' ? '2px solid green' : '1px solid black')};
  :hover {
    transform: scale(1.03)
  }
`;

interface IPinButtonProps {
  pinned: boolean;
}

const PinBtn = styled.button<IPinButtonProps>`
  border: none;
  background-color: ${props => (props.pinned ? props.theme.tables.pinnedButton : 'white')};
  color: ${props => (props.pinned ? props.theme.tables.pinnedButtonFontColor : 'black')};
  padding: 5px;
  border-radius: 3px;

  :hover {
    font-weight: bold;
    color: ${props => props.theme.tables.pinnedHover};
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
  data: any;
  userInputForTables: string;
  activeTableInPanel: any;
  selectedForQueryTables: any;
  relationships: any;
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
  relationships
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
  const [tablesRelated, setTablesRelated] = useState([]);

  useEffect(() => {
    const temptables = [];
    for (let table in relationships) {
      temptables.push(table);
      for (let i = 0; i < relationships[table].length; i++) {
        temptables.push(relationships[table][i].fktablename)
      }
      setTablesRelated(temptables);
    }
    setTablesRelated(temptables);
  }, [captureQuerySelections])

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
  }, [data, mouseOver, selectedForQueryTables]);

  //Builds out tables to display
  useEffect((): void => {
    const pinned = [];
    const filtered = [];

    if (data.length > 0) {
      const regex = new RegExp(userInputForTables);
      data.forEach(table => {
        let highlightForRelationship = 'false';
        if (tablesRelated.includes(table.table_name)) {
          console.log('related', tablesRelated)
          console.log('in her for', table.table_name)
          highlightForRelationship = 'true';
        }
        console.log(highlightForRelationship)
        if (pinnedTableNames.includes(table.table_name)) {
          pinned.push(
            <TableWrapper highlightForRelationship={highlightForRelationship}>
              <IndTableNav>
                <PinBtn
                  data-pinned={table.table_name}
                  onClick={() =>
                    dispatchPinned(actions.removeFromPinned(table.table_name))
                  }
                  pinned={true}
                >
                  UNPIN
                  </PinBtn>
                <ViewInfoButton
                  onClick={captureSelectedTable}
                  data-tablename={table.table_name}
                >View Info</ViewInfoButton>
              </IndTableNav>
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
            </TableWrapper>
          );
        } else if (regex.test(table.table_name)) {
          filtered.push(
            <TableWrapper highlightForRelationship={highlightForRelationship}>
              <IndTableNav>
                <PinBtn
                  data-pinned={table.table_name}
                  onClick={() =>
                    dispatchPinned(actions.addToPinned(table.table_name))
                  }
                  pinned={false}
                >
                  PIN
                  </PinBtn>
                <ViewInfoButton onClick={captureSelectedTable} data-tablename={table.table_name}>View Info</ViewInfoButton>
              </IndTableNav>
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
            </TableWrapper>
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

  if (pinnedTables.length || filteredTables.length) {
    return (
      <TablesWrapper>
        {pinnedTables}
        {filteredTables}
      </TablesWrapper>
    )
  } else {
    return (
      <NoSearchResults>
        There were no search results. <br /> Please search again.
        </NoSearchResults>
    )
  }
}

export default TablesContainer;