import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import * as actions from '../../actions/actions';
import Tables from '../../components/mainpanel/Tables';
import changePinnedStatus from '../../reducers/ChangePinnedStatus';
import { Text, Grommet } from "grommet";
import { grommet } from 'grommet/themes';
import { Pin, CircleInformation } from 'grommet-icons';

const TempWrapper = styled.div`
  display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    border: 1px solid white;
    border-radius: 3px;
    box-shadow: 2px 2px 8px lightgrey;
`

interface ITableWrapperProps {
  highlightForRelationship: string;
}

const TableWrapper = styled.div<ITableWrapperProps>`
  margin: 10px;
  width: 200px;
  border-radius: 3px;
  box-shadow: 2px 2px 8px lightgrey;
  border: ${({ highlightForRelationship }) => (highlightForRelationship == 'true' ? '3px solid #8106E9' : '3px solid transparent')};
  :hover {
    transform: scale(1.03)
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
          highlightForRelationship = 'true';
        }
        if (pinnedTableNames.includes(table.table_name)) {
          pinned.push(
            <TableWrapper highlightForRelationship={highlightForRelationship}>
              <Pin
                style={{ height: '15px', cursor: 'pointer' }}
                data-pinned={table.table_name}
                onClick={() =>
                  dispatchPinned(actions.removeFromPinned(table.table_name))
                }
                pinned={true}
                color="#F12B93"
              />
              <CircleInformation
                style={{ height: '15px', cursor: 'pointer' }}
                onClick={captureSelectedTable}
                data-tablename={table.table_name}
                color={(table.table_name === activeTableInPanel.table_name) ? "#149BD2" : 'black'}
              />
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
              <Pin
                style={{ height: '15px', cursor: 'pointer' }}
                data-pinned={table.table_name}
                onClick={() =>
                  dispatchPinned(actions.addToPinned(table.table_name))
                }
                pinned={false}
                color="black"
              />
              <CircleInformation
                onClick={captureSelectedTable}
                data-tablename={table.table_name}
                style={{ height: '15px', cursor: 'pointer' }}
                color={(table.table_name === activeTableInPanel.table_name) ? "#149BD2" : 'black'}
              />
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
      <Grommet theme={grommet}>
        <TempWrapper>
          {pinnedTables}
          {filteredTables}
        </TempWrapper>
      </Grommet>
    )
  } 
    return (
      <Text>
        There were no search results. <br /> Please search again.
      </Text>
    )
  
}

export default TablesContainer;