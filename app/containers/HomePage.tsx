import * as React from 'react';
import { useState, useEffect } from 'react';
import Tables from '../components/Tables';
import styled from 'styled-components';
import Panel from './Panel';

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

let renders = 0;
let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

const HomePage = (props) => {
  renders += 1;
  console.log('rendered ', renders);

  const tableData = props.location.state.tables;
  const [ data, setData ] = useState([]); //data from database
  const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
  const [ listOfTableNames, setlistOfTableNames ] = useState([]); //for Panel Component 
  const [ tableToRender, setRender ] = useState([]); //for main view  
  const [ foreignKeysAffected, setForeignKeysAffected ] = useState([]);
  const [ primaryKeyAffected, setPrimaryKeyAffected ] = useState([{
    primaryKeyTable: '',
    primaryKeyColumn: ''
  }]);

  useEffect(() => {
    //Resets all relationships 
    if(!mouseOver) {
      setPrimaryKeyAffected([{
        primaryKeyTable: '',
        primaryKeyColumn: ''
      }]);
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
          table.foreignKeys.forEach((foreignkey):void => {
            if(foreignkey.foreign_table_name === selectedTableName 
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

      const dataObj: Array<any> = data.map(table => {
        return (
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
        );
      });
      setRender(dataObj);
    }
  }, [data,foreignKeysAffected, primaryKeyAffected]);

  return (
    <EntireHomePageWrapper>
    <Panel listOfTableNames={listOfTableNames}/>
    <HomepageWrapper>
      {tableToRender}
    </HomepageWrapper>
    </EntireHomePageWrapper>
  );
};

export default HomePage;
