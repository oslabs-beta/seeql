import * as React from 'react';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';
import { Box, Tabs, Tab, Grommet, Button } from "grommet";
import { grommet } from 'grommet/themes';
import { FormTrash } from 'grommet-icons';

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
    return <Tab
      title={tabname}
    >
      <div>
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
      </div>
    </Tab>
  })

  return (
    <Grommet theme={grommet}>
      <Button style={{ fontSize: '10px', padding: '0px 5px' }} gap="xxsmall" icon={<FormTrash size="small" />} label="Reset Query" onClick={resetQuerySelection} />
      <Tabs activeIndex={activeDisplayInResultsTab} onActive={(index) => setActiveDisplayInResultsTab(index)}>
        {resultsTabs}
      </Tabs>

    </Grommet>
  )
}

export default ResultsContainer;