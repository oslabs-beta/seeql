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

const TableListItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
    border-bottom: 1px solid lightgrey;
    transition: 0.2s;
    :hover{
        transform: scale(1.05);
        background-color: #e3e0e9;
    }
`

const SelectTableBtn = styled.button`
    border: none;
    background: transparent;
    :hover{
        font-weight: bold;
        color: lightcoral;
    }
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
  const [filteredTables, setFilteredTables] = useState([]);
  const [userInputForTables, setUserInputForTables] = useState('');
  const [ data, setData ] = useState([]); //data from database
  const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
  const [ listOfTableNames, setlistOfTableNames ] = useState([]); //for Panel component 
  const [ tablesToRender, setRender ] = useState([]); //for main view  
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

  console.log('\n\t only pinned', onlyPinned)

  useEffect(() => {
    let filtered = []; let pinned = [];

    listOfTableNames.forEach((tableName) => {
        if (onlyPinned.includes(tableName)) {
          pinned.push(
           <TableListItem key={tableName} >
            {tableName}
            <SelectTableBtn
              data-pinned={tableName}
              onClick={removeFromPinned}
            >PINNED KAREN
            </SelectTableBtn>
          </TableListItem>
          )
        } else { 
          const regex = new RegExp(userInputForTables)

          if(regex.test(tableName)) {
            filtered.push(
              <TableListItem 
                key={tableName}
              >
                {tableName}
                <SelectTableBtn 
                  data-pinned={tableName} 
                  onClick={addToPinned}>
                  Add
                </SelectTableBtn>
              </TableListItem>
            );
        }
     }
  })

  console.log(pinned)
    setFilteredTables(filtered)
    setPinnedTables(pinned)

},[userInputForTables, listOfTableNames, onlyPinned]);

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
    if (data.length > 0) {
      const searchPanelTableNames = [];
      data.forEach(table => searchPanelTableNames.push(table.table_name));
      setlistOfTableNames(searchPanelTableNames);

      const dataObjArray: Array<any> = []
      const regex = new RegExp(userInputForTables)
        data.forEach(table => {
          if (regex.test(table.table_name)) {
            dataObjArray.push(
              <Tables
                tableName={table.table_name}
                columns={table.columns}
                primarykey={table.primaryKey}
                foreignkeys={table.foreignKeys}
                primaryKeyAffected={primaryKeyAffected}
                foreignKeysAffected={foreignKeysAffected}
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

            )
          }
      });
      setRender(dataObjArray);
    }
  }, [
    data,
    foreignKeysAffected, 
    primaryKeyAffected, 
    userInputForTables
  ]);

  const searchInputCapture = e => setUserInputForTables(e.target.value)

  return (
    <EntireHomePageWrapper>
    <Panel 
      pinnedTables={pinnedTables}
      filteredTables={filteredTables} 
      searchInput={searchInputCapture} 
      listOfTableNames={listOfTableNames}/>

    <HomepageWrapper>
      {
        // #TODO: flashes empty state on load, figure out why
        tablesToRender.length ? tablesToRender :
        <EmptyState>
          no matches found, KAREN
        </EmptyState>
      }
    </HomepageWrapper>
    </EntireHomePageWrapper>
  );
};

export default HomePage;
