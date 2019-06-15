import * as React from "react";
import { useState, useEffect, useReducer } from "react";
import Tables from "../components/Tables";
import styled from "styled-components";
import Panel from "./Panel";
import LoadingComponent from "../components/LoadComponent";
import { ipcRenderer } from "electron";
import QueryResults from "../components/QueryResults";
import changePinnedStatus from "../reducers/ChangePinnedStatus"
import * as actions from '../actions/actions';

interface IBottomPanelNavButtonProps {
  activeDisplayInBottomTab: string
  activetabname: string
} 

const BottomPanelNav = styled.nav`
  display: flex;
  justify-content: space-around;
`

const OmniBoxNav = styled.nav`
  display: relative;
  right: 50px;
  top: -40px;
`

const BottomPanelNavButton = styled.button<IBottomPanelNavButtonProps>`
  font-family: 'Poppins', sans-serif;
  border: none;
  border-bottom: ${({activeDisplayInBottomTab, activetabname}) => (activeDisplayInBottomTab === activetabname) ? "2px solid pink" : "2px solid transparent"};
  padding: 5px;
  transition: 0.3s;
  :focus {
    outline: none;
  }
  :hover {
    border-bottom: 2px solid black;
  }
`

const RightPanel = styled.div`
  border: 1px solid black;
`
const OMNIboxInput = styled.textarea`
  font-family: 'Poppins', sans-serif;
  height: 50px;
  width: 50vw;
  padding: 5px;
  resize:none;
  :focus{
    outline: none;
  }
`

const InvisibleHeader = styled.div`
  height: 30px;
  display: relative;
  -webkit-app-region: drag;
`
const NormalTable = styled.div`
overflow: scroll;
display: absolute;
`

const PinnedTable = styled.div`
  display: absolute;
`

interface IPinBtnProps{
  pinned: boolean
}


const PinBtn = styled.button<IPinBtnProps>`
  display: relative;
  border: none;
  background-color: ${(props) => props.pinned ? 'rgb(93, 0, 250)' : 'white'};
  color: ${(props) => props.pinned ? 'white' : 'black'};
  padding: 2px 5px;
  border-radius: 6px;
  margin: 2px 0px;

  :hover {
    font-weight: bold;
    color: #00b5cc;
  }
  :focus {
    outline: none;
  }
`

const HomepageWrapper = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex; 
  flex-wrap: wrap;
`

const EntireHomePageWrapper = styled.div`
  display: flex;
  margin-top: -30px;
  overflow: wrap;
  font-family: 'Poppins', sans-serif;
`;

const LoadWrap = styled.div`
  display: flex;
  width: 100%;
`;

const EmptyState= styled.div`
  height: 100vh;
  width: 100%;
  padding: 20px;  
  display: flex;
  justify-content: center;
  align-items: center;
`

let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

const HomePage = (props) => {

  const tableData = props.location.state.tables;
  const [activeDisplayInBottomTab, setActiveDisplayInBottomTab] = useState('tables');
  const [activeTableInPanel, setActiveTableInPanel] = useState({});
  const [filteredTables, setFilteredTables] = useState([]);
  const [userInputForTables, setUserInputForTables] = useState('');
  const [data, setData] = useState([]); //data from database
  const [mouseOver, setMouseOver] = useState(); //data to detect if mouse is over a pk or fk
  const [toggleLoad, setToggleLoad] = useState(true);
  const [foreignKeysAffected, setForeignKeysAffected ] = useState([]);
  const [primaryKeyAffected, setPrimaryKeyAffected ] = useState([{
    primaryKeyTable: '',
    primaryKeyColumn: ''
  }]);
  const [pinnedTables, setPinnedTables] = useState([]);
  const [onlyPinned, dispatch] = useReducer(changePinnedStatus, [])
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  const [omniBoxView, setOmniBoxView] = useState('plain');

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
              <PinBtn data-pinned={table.table_name} onClick={() => dispatch(actions.removeFromPinned(table.table_name))} pinned={true}>UNPIN</PinBtn>
              <Tables
                activeTableInPanel={activeTableInPanel}
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
              <PinBtn data-pinned={table.table_name} onClick={() => dispatch(actions.addToPinned(table.table_name))} pinned={false}>PIN</PinBtn>
              <Tables
                activeTableInPanel={activeTableInPanel}
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
    onlyPinned,
    activeTableInPanel
  ]);

  const activeTabcapture = (e) => setActiveDisplayInBottomTab(e.target.dataset.activetabname);

  const executeQueryOnEnter = (e) => {
    console.log('pressed a key!', e.which, e.keyCode);
    const code = e.keyCode || e.which;
    if(code === 13) { //13 is the enter keycode
      ipcRenderer.send("query-to-main", query);
    }
  }
  // #TODO: Connect this ipc communication with new query input
  const executeQuery = () => {
    ipcRenderer.send("query-to-main", query);
  }

  ipcRenderer.removeAllListeners("query-result-to-homepag")
  ipcRenderer.on("query-result-to-homepage", (event, queryResult) => {
    if(queryResult.statusCode === 'Success'){
      setQueryResult(queryResult.message);
      setActiveDisplayInBottomTab('queryresults')
    }
  });

  return (
    <React.Fragment>
    <InvisibleHeader ></InvisibleHeader>
    <EntireHomePageWrapper>
    <Panel 
      activeTableInPanel={activeTableInPanel} />
       {toggleLoad && (
        <LoadWrap>
          <LoadingComponent />
        </LoadWrap>
      )}
      <RightPanel>
      { omniBoxView === 'SQL' &&  
      <div>
        <OMNIboxInput 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="SELECT * FROM ..."
          onKeyPress={executeQueryOnEnter}
          ></OMNIboxInput>
        <button onClick={executeQuery}>Execute Query</button>
      </div>
      } 
      {omniBoxView === 'plain' &&  
      <OMNIboxInput
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
      ></OMNIboxInput>
      }
      <OmniBoxNav>
        <button onClick={() => setOmniBoxView('SQL')}>SQL</button>
        <button onClick={() => setOmniBoxView('plain')}>PLAIN</button>
      </OmniBoxNav>
      <BottomPanelNav>
        <BottomPanelNavButton activeDisplayInBottomTab={activeDisplayInBottomTab} activetabname='tables' data-activetabname='tables' onClick={activeTabcapture}>Tables</BottomPanelNavButton>
        <BottomPanelNavButton activeDisplayInBottomTab={activeDisplayInBottomTab} activetabname='queryresults' data-activetabname='queryresults' onClick={activeTabcapture}>Query Results</BottomPanelNavButton>
      </BottomPanelNav>
      {  activeDisplayInBottomTab==='tables' &&
        ((pinnedTables.length  || filteredTables.length)? <HomepageWrapper>{pinnedTables}{filteredTables}</HomepageWrapper>:
        <EmptyState>
          There were no search results. Please search again.
        </EmptyState>)
      }
      { activeDisplayInBottomTab==='queryresults' &&
        <QueryResults queryResult={queryResult}/>
      }
      </RightPanel>
    </EntireHomePageWrapper>
    </React.Fragment>
  );
};

export default HomePage;
