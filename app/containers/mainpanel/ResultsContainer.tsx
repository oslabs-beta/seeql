import * as React from 'react';
import styled from 'styled-components';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  background-color: white;
  height: 100%;
  margin-top: 15px;
  min-width: 400px;
  box-shadow: 1px 1px 4px #67809f;
    border-radius: 3px;
      font-family: 'Poppins', sans-serif;
`

const SRestTabsRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
    font-family: 'Poppins', sans-serif;
`

const SResNavTabs = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
    font-family: 'Poppins', sans-serif;
`

interface SResultsNavButtonProps {
  activeDisplayInResultsTab: string;
  activetabname: string;
}


const SResultsNavButton = styled.button<SResultsNavButtonProps>`
  border: none;
  font-size: 80%;
  margin: 0px 5px;
    font-family: 'Poppins', sans-serif;
  color: ${({ activeDisplayInResultsTab, activetabname }) => activeDisplayInResultsTab === activetabname ? '#4B70FE' : '#485360'};
  border-bottom: ${({ activeDisplayInResultsTab, activetabname }) => activeDisplayInResultsTab === activetabname ? '2px solid #4B70FE' : '2px solid transparent'};
  transition: all 0.2s;
  cursor: pointer;
  
  :hover {
    border-bottom: 2px solid #4B70FE;
  }

  :focus{
    outline: none;
  }

`

const SResetQueryButton = styled.button`
border: none;
font-size: 70%;
cursor: pointer;
transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
:hover{
  color: #ca333e;
  span {
    visibility: visible;
  }

}
  :focus {
    outline: none;
  }
    span{
    visibility: hidden;
    font-weight: bold;
    position: relative;
      background-color: #fef5e7;
      color: #f5ab35;
      text-align: center;
      border-radius: 10px;
      padding: 8px
      top: 5px;
      margin: 0px 3px;
        transition: all 0.2s;
      }
      
}
`

const STopNav = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  min-height: 40px;
  border-bottom: 1px solid #dadfe1;
`

const TooManySelectedTablesWarning = styled.div`
  color: #f5ab35;
    font-family: 'Poppins', sans-serif;
  border-radius: 3px;
  border-left: 3px solid #f5ab35;
  font-size: 80%;
  background-color: #fef5e7;
  margin: 5px 0px;
  padding: 5px;
  width: 80%;
  align-self: center;
`;

interface IResultsContainerProps {
  activeDisplayInResultsTab: string;
  queryResult: any;
  data: any;
  userInputForTables: string;
  activeTableInPanel: any;
  selectedForQueryTables: any;
  relationships;
  overThreeTablesSelected: any;
  resetQuerySelection: (any) => any;
  captureQuerySelections: (any) => any;
  captureSelectedTable: (any) => any;
  setActiveDisplayInResultsTab: (any) => any;
}

const ResultsContainer: React.SFC<IResultsContainerProps> = ({
  activeDisplayInResultsTab,
  queryResult,
  userInputForTables,
  activeTableInPanel,
  selectedForQueryTables,
  data,
  captureSelectedTable,
  captureQuerySelections,
  setActiveDisplayInResultsTab,
  resetQuerySelection,
  relationships,
  overThreeTablesSelected
}) => {

  const listOfTabNames = ['Tables', 'Query Results'];

  const resultsTabs = listOfTabNames.map((tabname) => {
    return <SResultsNavButton
      key={tabname}
      activeDisplayInResultsTab={activeDisplayInResultsTab}
      activetabname={tabname}
      onClick={() => setActiveDisplayInResultsTab(tabname)}
    >{tabname}</SResultsNavButton>
  })

  return (
    <ResultsWrapper>
      <STopNav>
        <SResNavTabs>
          {resultsTabs}
        </SResNavTabs>
        <SRestTabsRight>
          <SResetQueryButton onClick={resetQuerySelection}><span>This will remove all selected columns</span>Reset Query</SResetQueryButton>
        </SRestTabsRight>
      </STopNav>
      {overThreeTablesSelected &&
        <TooManySelectedTablesWarning>Automatic query generation only works on one or two tables. Please unselect any additional tables or reset the query.</TooManySelectedTablesWarning>
      }
      {activeDisplayInResultsTab === 'Tables' &&
        <TablesContainer
          key={activeDisplayInResultsTab}
          relationships={relationships}
          userInputForTables={userInputForTables}
          activeTableInPanel={activeTableInPanel}
          selectedForQueryTables={selectedForQueryTables}
          data={data}
          captureSelectedTable={captureSelectedTable}
          captureQuerySelections={captureQuerySelections}
        />
      }
      {activeDisplayInResultsTab === 'Query Results' && (
        <QueryResults key={queryResult} queryResult={queryResult} />
      )}
    </ResultsWrapper>
  )
}

export default ResultsContainer;