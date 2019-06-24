import * as React from 'react';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';
import { Tabs, Tab, Grommet, Button } from "grommet";
import { grommet } from 'grommet/themes';
import { FormTrash } from 'grommet-icons';

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
    return <Tab
      title={tabname}
    >
        {tabname === 'Tables' ?
        <TablesContainer
          relationships={relationships}
          userInputForTables={userInputForTables}
          activeTableInPanel={activeTableInPanel}
          selectedForQueryTables={selectedForQueryTables}
          data={data}
          captureSelectedTable={captureSelectedTable}
          captureQuerySelections={captureQuerySelections}
        />
        :
        <QueryResults queryResult={queryResult} />
      }
    </Tab>
  })

  return (
    <Grommet theme={grommet}> 
        <Button  icon={<FormTrash />} label="Reset Query"onClick={resetQuerySelection} />
        <Tabs>
          {resultsTabs}
        </Tabs>
    </Grommet>
  )
}

export default ResultsContainer;