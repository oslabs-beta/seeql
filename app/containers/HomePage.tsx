import * as React from "react";
import { useState, useEffect } from "react";
import Tables from "../components/Tables";
import styled from "styled-components";
import Panel from "./Panel";
import LoadingComponent from "../components/LoadComponent";

// interface ForeignKey {
//  foreign_table_name: string; 
//  foreign_column_name: string; 
//  table_name: any; 
//  column_name: any; 
// }

const NormalTable = styled.div`
overflow: scroll;
display: absolute;
`

const PinnedTable = styled.div`
  border: 2px solid grey;
  overflow: scroll;
  display: absolute;
`

const PinBtn = styled.button`
  display: relative;
`

const HomepageWrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow: scroll;
  padding: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-template-rows: 150px auto;
`

const EntireHomePageWrapper = styled.div`
  display: flex;
`;

const LoadWrap = styled.div`
  display: flex;
  width: 100%;
`;

const EmptyState= styled.div`
  background-color: black;
  color: white;
`

let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

// The Store, basically
const HomePage = (props) => {
  // renders += 1;
  // console.log('rendered ', renders);
  const tableData = props.location.state.tables;
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [filteredTables, setFilteredTables] = useState([]);
  const [userInputForTables, setUserInputForTables] = useState('');
  const [ data, setData ] = useState([]); //data from database
  const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
  const [toggleLoad, setToggleLoad] = useState(true);
  const [ foreignKeysAffected, setForeignKeysAffected ] = useState([]);
  const [ primaryKeyAffected, setPrimaryKeyAffected ] = useState([{
    primaryKeyTable: '',
    primaryKeyColumn: ''
  }]);
  const [ pinnedTables, setPinnedTables ] = useState([]);
  const [onlyPinned, setOnlyPinned] = useState([]);

  const removeFromPinned = (e) => { 
    let noLongerPinned = onlyPinned.filter(table => table !== e.target.dataset.pinned)
    setOnlyPinned(noLongerPinned)
  }

  const addToPinned = (e) => { 
    let pinnedCopy = onlyPinned.slice()
    pinnedCopy.push(e.target.dataset.pinned)
    setOnlyPinned(pinnedCopy)
  }

  const captureSelectedTable = (e) => {
    const tablename = e.target.dataset.tablename;
    let selectedPanelInfo;
    let primaryKey;

    data.forEach((table) => {
      if(table.table_name === tablename) {
        primaryKey = table.primaryKey;
        selectedPanelInfo = table;
      }
    })

    selectedPanelInfo.foreignKeysOfPrimary = {};

    data.forEach((table) => {
      table.foreignKeys.forEach((foreignKey) => {
        if(foreignKey.foreign_column_name == primaryKey &&
          foreignKey.foreign_table_name == tablename) {
            selectedPanelInfo.foreignKeysOfPrimary[foreignKey.table_name] = foreignKey.column_name
          }
      })
    })
    
    setActiveTableInPanel(selectedPanelInfo)
  }

  useEffect(() => {
    if(!mouseOver) { //Resets all relationships 
      setPrimaryKeyAffected([{ primaryKeyTable: '', primaryKeyColumn: '' }]);
      setForeignKeysAffected([]);
    }

    //Determines which rows should be highlighted
    if (mouseOver) {
      if (isForeignKey == "true") {
        setPrimaryKeyAffected([ { primaryKeyTable: primaryKeyTableForForeignKey, primaryKeyColumn: primaryKeyColumn } ]);
      }

      if (isPrimaryKey === "true") {
        const allForeignKeys: Array<any> = [];
        data.forEach((table): void => {
          table.foreignKeys.forEach((foreignkey): void => {
            if ( foreignkey.foreign_table_name === selectedTableName && foreignkey.foreign_column_name === selectedColumnName)
              allForeignKeys.push({ table: foreignkey.table_name, column: foreignkey.column_name });
          });
        });
        setForeignKeysAffected(allForeignKeys);
      }
    }
  }, [mouseOver]);

  //Fetches database information
  useEffect((): void => {
    setToggleLoad(true);
    setData(tableData);
    setToggleLoad(false);
  }, []);

  //Builds out tables to display
  useEffect(():void => {

    let pinned = [];
    let filtered = [];

    if (data.length > 0) {
      const regex = new RegExp(userInputForTables)
        data.forEach(table => {

          if (onlyPinned.includes(table.table_name)) {

            pinned.push(
              <PinnedTable>
              <PinBtn data-pinned={table.table_name} onClick={removeFromPinned} >UNPIN</PinBtn>
              <Tables
                tableName={table.table_name}
                columns={table.columns}
                primarykey={table.primaryKey}
                foreignkeys={table.foreignKeys}
                primaryKeyAffected={primaryKeyAffected}
                foreignKeysAffected={foreignKeysAffected}
                captureSelectedTable={captureSelectedTable}
                captureMouseEnter={(e) => {
                isPrimaryKey= e.target.dataset.isprimarykey;
                isForeignKey = e.target.dataset.isforeignkey;
                primaryKeyTableForForeignKey = e.target.dataset.foreignkeytable;
                primaryKeyColumn = e.target.dataset.foreignkeycolumn;
                selectedTableName = e.target.dataset.tablename;
                selectedColumnName = e.target.dataset.columnname;
                setMouseOver(true)
                }}
                captureMouseExit= {() => {
                  setMouseOver(false)}}
                key={table.table_name}
              />
              </PinnedTable>
            )

          }

          else if (regex.test(table.table_name)) {

            filtered.push(
              <NormalTable>
              <PinBtn data-pinned={table.table_name} onClick={addToPinned} >PIN</PinBtn>
              <Tables
                tableName={table.table_name}
                columns={table.columns}
                primarykey={table.primaryKey}
                foreignkeys={table.foreignKeys}
                primaryKeyAffected={primaryKeyAffected}
                foreignKeysAffected={foreignKeysAffected}
                captureSelectedTable={captureSelectedTable}
                captureMouseEnter={(e) => {
                isPrimaryKey= e.target.dataset.isprimarykey;
                isForeignKey = e.target.dataset.isforeignkey;
                primaryKeyTableForForeignKey = e.target.dataset.foreignkeytable;
                primaryKeyColumn = e.target.dataset.foreignkeycolumn;
                selectedTableName = e.target.dataset.tablename;
                selectedColumnName = e.target.dataset.columnname;
                setMouseOver(true)
                }}
                captureMouseExit= {() => {
                  setMouseOver(false)}}
                key={table.table_name}
              />
              </NormalTable>
            )
          }
      });
      setFilteredTables(filtered)
      setPinnedTables(pinned)
    }
  }, [
    data,
    foreignKeysAffected, 
    primaryKeyAffected, 
    userInputForTables,
    onlyPinned
  ]);

  const searchInputCapture = e => setUserInputForTables(e.target.value)

  return (
    <EntireHomePageWrapper>
    <Panel 
      searchInput={searchInputCapture}
      activeTableInPanel={activeTableInPanel} />

       {toggleLoad && (
        <LoadWrap>
          <LoadingComponent />
        </LoadWrap>
      )}

      {
        (pinnedTables.length  || filteredTables.length)? <HomepageWrapper>{pinnedTables}{filteredTables}</HomepageWrapper> :
        <EmptyState>
          no matches found, KAREN
        </EmptyState>
      }
    </EntireHomePageWrapper>
  );
};

export default HomePage;
