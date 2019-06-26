import * as React from 'react';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';
// import { Tabs, Tab, Button } from "grommet";
// import { grommet } from 'grommet/themes';
// import { FormTrash } from 'grommet-icons';
import styled from 'styled-components';

const ResultsWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  height: 100%;
  margin-top: 15px;
  min-width: 400px;
  box-shadow: 1px 1px 4px #67809f;
`

const SInnerBottmPanelWrapper = styled.div`

`

interface IResultsContainerProps {
  activeDisplayInResultsTab: number;
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
      <div>
        <div>
          {resultsTabs}
        </div>
        <button onClick={resetQuerySelection}>Reset Query</button>
      </div>
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