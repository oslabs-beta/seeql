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

const HomePage = (props) => {

  const tableData = props.location.state.tables;
  const [ data, setData ] = useState([]); //data from database
  const [ listOfTableNames, setlistOfTableNames ] = useState([]); //for Panel Component 
  const [ tableToRender, setRender ] = useState([]); //for main view  
  const [ foreignKeysAffected, setForeignKeysAffected ] = useState([]);
  const [ primaryKeyAffected, setPrimaryKeyAffected ] = useState([{
    primaryKeyTable: '',
    primaryKeyColumn: ''
  }]);
  
  //function generates a mock unique ID for React Components
  const generateUniqueKey = () => (Math.random() * 1000).toString();

  //Fetches database information
  useEffect(() => {
    setData(tableData);
  },[]);

  //Resets all relationships 
  const removeRelationshipDisplay = () => {
    setPrimaryKeyAffected([{
      primaryKeyTable: '',
      primaryKeyColumn: ''
    }]);
    setForeignKeysAffected([]);
  }

  //Determines which rows should be highlighted
  const highlightRelationships = (e):void => {
    const isPrimaryKey: string = e.target.dataset.isprimarykey;
    const isForeignKey: string = e.target.dataset.isforeignkey;
    const primaryKeyTableForForeignKey: string = e.target.dataset.foreignkeytable;
    const primaryKeyColumn: string = e.target.dataset.foreignkeycolumn;
    const selectedTableName: string = e.target.dataset.tablename;
    const selectedColumnName: string = e.target.dataset.columnname;

    if (isForeignKey === 'true'){
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
            displayRelationships={highlightRelationships}
            removeRelationships={removeRelationshipDisplay}
            key={generateUniqueKey()}
          />
        );
      });
      setRender(dataObj);
    }
  }, [data, foreignKeysAffected, primaryKeyAffected]);

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
