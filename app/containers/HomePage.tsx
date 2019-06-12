import * as React from 'react';
import { useState, useEffect } from 'react';
import Tables from '../components/Tables';
import styled from 'styled-components';
import Panel from './Panel';

interface ForeignKey {
 foreign_table_name: string; 
 foreign_column_name: string; 
 table_name: any; 
 column_name: any; 
}

const PinnedTable = styled.div`
  border: 2px solid grey;
`



const HomepageWrapper = styled.div`
  height: 100vh;
  overflow: scroll;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  padding: 50px;
`

const EntireHomePageWrapper = styled.div`
  display: flex;
`

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
  const [ foreignKeysAffected, setForeignKeysAffected ] = useState([]);
  const [ primaryKeyAffected, setPrimaryKeyAffected ] = useState([{
    primaryKeyTable: '',
    primaryKeyColumn: ''
  }]);
  const [ pinnedTables, setPinnedTables ] = useState([]);
  const [onlyPinned, setOnlyPinned] = useState([]);

  console.log('selected table ',data )
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
  if(mouseOver) {
    if (isForeignKey == 'true'){
      setPrimaryKeyAffected([{
        primaryKeyTable: primaryKeyTableForForeignKey,
        primaryKeyColumn: primaryKeyColumn
      }])
    }

    if (isPrimaryKey === 'true') {
      const allForeignKeys: Array<any> = [];
      data.forEach((table):void => {
          table.foreignKeys.forEach((foreignkey: ForeignKey):void => {
            if (
              foreignkey.foreign_table_name === selectedTableName 
              && foreignkey.foreign_column_name === selectedColumnName
            )
            allForeignKeys.push({
              table: foreignkey.table_name,
              column: foreignkey.column_name
            })
          }) 
      }) 
      setForeignKeysAffected(allForeignKeys);
     } 
   }
  }, [mouseOver]) 

  //Fetches database information
  useEffect(():void => {
    setData(tableData);
  },[]);

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
              <button data-pinned={table.table_name} onClick={removeFromPinned} >UNPIN for {table.table_name}</button>
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
              <div>
              <button data-pinned={table.table_name} onClick={addToPinned} >PIN for {table.table_name}</button>
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
              </div>
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
      onlyPinned={onlyPinned}
      searchInput={searchInputCapture}
      removeFromPinned={removeFromPinned}
      addToPinned={addToPinned}
      activeTableInPanel={activeTableInPanel} />
      {
        // #TODO: flashes empty state on load, figure out why
        (pinnedTables.length  || filteredTables.length)? <HomepageWrapper>{pinnedTables}{filteredTables}</HomepageWrapper> :
        <EmptyState>
          no matches found, KAREN
        </EmptyState>
      }
    </EntireHomePageWrapper>
  );
};

export default HomePage;
