import * as React from "react";
import { useState, useEffect, useReducer } from "react";
import { ipcRenderer } from "electron";
import styled from "styled-components";
import * as actions from '../actions/actions';
import changePinnedStatus from "../reducers/ChangePinnedStatus"
import Tables from "../components/Tables";
import LeftPanel from "./Panel";
import LoadingComponent from "../components/LoadComponent";
import QueryResults from "../components/QueryResults";

const InvisibleHeader = styled.div`
  height: 30px;
  display: relative;
  -webkit-app-region: drag;
`

const HomepageWrapper = styled.div`
  display: flex;
  margin-top: -30px;
  font-family: 'Poppins', sans-serif;
  width: 100vw;
  height: 100vh;
`;

const RightPanel = styled.div`

`

const OMNIBoxContainer = styled.div`
  padding: 20px;
  margin-top: 30px;
  width: 70vw;
`

const OMNIboxInput = styled.textarea`
  font-family: 'Poppins', sans-serif;
  padding: 8px;
  height: 100px;
  width: 60vw;
  border-radius: 3px;
  letter-spacing: 2px;
  resize: none;

  :focus{
    outline: none;
  }
`

const ExecuteQueryButton = styled.button`
  border: none;
  border-radius: 3px;
  background-color: #086375;
  transition: 0.2s;
  color: white;
  padding: 5px;

  :hover {
    background-color: #042D36;
  }

  :focus{
    outline: none;
  }
`
interface IOMNIBoxNavButtonsProps {
  omniBoxView: string
  selectedView: string
}

const OMNIBoxNavButtons = styled.button<IOMNIBoxNavButtonsProps>`
  padding: 5px;
  border-radius: 3px 3px 0px 0px;
  border: none;
  background-color: ${({omniBoxView, selectedView}) => (selectedView === omniBoxView) ? '#3C1642' : 'transparent' };
  color: ${({omniBoxView, selectedView}) => (selectedView === omniBoxView) ? 'white' : 'black' };
  
  :focus {
    outline: none;
  }
`
const OmniBoxNav = styled.nav`
  display: flex;
`
const BottomPanelNav = styled.nav`
  display: flex;
  justify-content: space-around;
`

interface IBottomPanelNavButtonProps {
  activeDisplayInBottomTab: string
  activetabname: string
} 

const BottomPanelNavButton = styled.button<IBottomPanelNavButtonProps>`
  font-family: 'Poppins', sans-serif;
  border: none;
  border-bottom: ${({activeDisplayInBottomTab, activetabname}) => (activeDisplayInBottomTab === activetabname) ? "3px solid black" : "3px solid transparent"};
  padding: 5px;
  transition: 0.3s;
  border-radius: 3px;
  :focus {
    outline: none;
  }
  :hover {
    border-bottom: 3px solid black;
  }
`

const BottomPanel = styled.div`
  background-color: transparent;
  overflow: scroll;
`

const TablesContainer = styled.div`
  padding: 20px;
  display: flex; 
  flex-wrap: wrap;
`
const EmptyState = styled.div`
  padding: 20px;  
`

const NormalTableWrapper = styled.div`
  margin: 5px;
`

const PinnedTableWrapper = styled.div`
  margin: 5px;
`

interface IPinButtonProps{
  pinned: boolean
}

const PinBtn = styled.button<IPinButtonProps>`
  border: none;
  background-color: ${(props) => props.pinned ? 'rgb(93, 0, 250)' : 'white'};
  color: ${(props) => props.pinned ? 'white' : 'black'};
  padding: 5px;
  border-radius: 3px;

  :hover {
    font-weight: bold;
    color: #00b5cc;
  }
  :focus {
    outline: none;
  }
`

const LoadWrap = styled.div`
  display: flex;
  width: 100%;
`;

interface IForeignKey {
  table: string
  column: string
}

let isPrimaryKey: string;
let isForeignKey: string;
let primaryKeyTableForForeignKey: string;
let primaryKeyColumn: string;
let selectedTableName: string;
let selectedColumnName: string;

const HomePage = ({location}) => {

  const allTablesMetaData = location.state.tables;
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
  const [omniBoxView, setOmniBoxView] = useState('SQL');
  const [userInputQuery, setUserInputQuery] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  const [pinnedTableNames, dispatch] = useReducer(changePinnedStatus, [])

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
        const allForeignKeys: Array<IForeignKey> = [];
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
    setData(allTablesMetaData);
    setToggleLoad(false);
  }, []);

  //Builds out tables to display
  useEffect(():void => {

    let pinned = [];
    let filtered = [];

    if (data.length > 0) {
      const regex = new RegExp(userInputForTables)
        data.forEach(table => {

          if (pinnedTableNames.includes(table.table_name)) {

            pinned.push(
              <PinnedTableWrapper>
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
              </PinnedTableWrapper>
            )

          }

          else if (regex.test(table.table_name)) {

            filtered.push(
              <NormalTableWrapper>
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
              </NormalTableWrapper>
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
    pinnedTableNames,
    activeTableInPanel

  ]);

  const activeTabcapture = (e):void => {
    setActiveDisplayInBottomTab(e.target.dataset.activetabname);
    if (e.target.dataset.activetabname === 'plain') setUserInputQuery('');
    if (e.target.dataset.activetabname === 'SQL') setUserInputForTables('');
  }

  const executeQueryOnEnter = (e):void => {
    const code:number = e.keyCode || e.which;
    if(code === 13) { //13 is the enter keycode
      ipcRenderer.send("query-to-main", userInputQuery);
    }
  }
  // #TODO: Connect this ipc communication with new query input
  const executeQuery = ():void => {
    ipcRenderer.send("query-to-main", userInputQuery);
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
    <HomepageWrapper>
      <LeftPanel activeTableInPanel={activeTableInPanel} />
       {toggleLoad && (
        <LoadWrap>
          <LoadingComponent />
        </LoadWrap>
       )}
      <RightPanel>
      <OMNIBoxContainer>
      <OmniBoxNav>
        <OMNIBoxNavButtons 
          onClick={() => {setOmniBoxView('SQL')}}
          omniBoxView={omniBoxView}
          selectedView='SQL'
          >SQL</OMNIBoxNavButtons>
        <OMNIBoxNavButtons 
          onClick={() => {setOmniBoxView('plain')}}
          omniBoxView={omniBoxView}
          selectedView='plain'
          >PLAIN</OMNIBoxNavButtons>
      </OmniBoxNav>
      { omniBoxView === 'SQL' &&  
        <React.Fragment>
        <OMNIboxInput 
          onChange={(e) => setUserInputQuery(e.target.value)} 
          placeholder="SELECT * FROM ..."
          onKeyPress={executeQueryOnEnter}
          ></OMNIboxInput>
        <ExecuteQueryButton onClick={executeQuery}>Execute Query</ExecuteQueryButton>
        </React.Fragment>
      } 
      {omniBoxView === 'plain' &&  
      <OMNIboxInput
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
      ></OMNIboxInput>
      }
      </OMNIBoxContainer>
      <BottomPanelNav>
        <BottomPanelNavButton activeDisplayInBottomTab={activeDisplayInBottomTab} activetabname='tables' data-activetabname='tables' onClick={activeTabcapture}>Tables</BottomPanelNavButton>
        <BottomPanelNavButton activeDisplayInBottomTab={activeDisplayInBottomTab} activetabname='queryresults' data-activetabname='queryresults' onClick={activeTabcapture}>Query Results</BottomPanelNavButton>
      </BottomPanelNav>
        <BottomPanel>
        {activeDisplayInBottomTab==='tables' &&
          ((pinnedTables.length  || filteredTables.length)? <TablesContainer>{pinnedTables}{filteredTables}</TablesContainer>:
          <EmptyState>
            There were no search results. Please search again.
          </EmptyState>)
        }
        { activeDisplayInBottomTab==='queryresults' &&
          <QueryResults queryResult={queryResult}/>
        }
        </BottomPanel>
      </RightPanel>
    </HomepageWrapper>
    </React.Fragment>
  );
};

export default HomePage;
