import * as React from 'react';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';
import styled from 'styled-components';

const ResultsWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  height: 100%;
  margin-top: 15px;
  min-width: 400px;
  box-shadow: 1px 1px 4px #67809f;
`

const SResetQueryButton = styled.button`
border: none;
font-size: 70%;
cursor: pointer;
transition: all 0.2s;

:hover{
  color: #7540D9;
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
      background-color: #fef5e7;
      color: #f5ab35;
      text-align: center;
      border-radius: 10px;
      padding: 8px
      margin: 0px 3px;
      }
      
}
`

const STopNav = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  height: 40px;
`

interface IResultsContainerProps {
  activeDisplayInResultsTab: string;
  queryResult: any;
  data: any;
  userInputForTables: string;
  activeTableInPanel: any;
  selectedForQueryTables: any;
  relationships;
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
  relationships
}) => {

  const listOfTabNames = ['Tables', 'Query Results'];

  const resultsTabs = listOfTabNames.map((tabname) => {
    return <button
      key={tabname}
      activeDisplayInResultsTab={activeDisplayInResultsTab}
      activetabname={tabname}
      onClick={() => setActiveDisplayInResultsTab(tabname)}
    >{tabname}</button>
  })

  return (
    <ResultsWrapper>
      <STopNav>
        <div>
          {resultsTabs}
        </div>
        <SResetQueryButton onClick={resetQuerySelection}><span>This will remove all selected columns</span>Reset Query</SResetQueryButton>
      </STopNav>
      {activeDisplayInResultsTab === 'Tables' &&
        <TablesContainer
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
        <QueryResults queryResult={queryResult} />
      )}
    </ResultsWrapper>
  )
}

export default ResultsContainer;