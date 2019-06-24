import * as React from 'react';
import styled from 'styled-components';
import QueryResults from "../../components/mainpanel/QueryResults";
import TablesContainer from './TablesContainer';

const ResultsWrapper = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
`;

const ResultsNav = styled.nav`
  display: flex;
  justify-content: center;
  align-self: flex-start;

`;

interface IResultsNavButtonProps {
  activeDisplayInResultsTab: string;
  activetabname: string;
}

const ResultsNavButton = styled.button<IResultsNavButtonProps>`
    font-family: 'Poppins', sans-serif;
    border: none;
    border-bottom: ${({ activeDisplayInResultsTab, activetabname }) =>
    (activeDisplayInResultsTab === activetabname)
      ? '3px solid #E55982'
      : '3px solid transparent'};
    padding: 8px;
    transition: 0.3s;
    font-size: 80%;
    background-color: ${props => props.theme.tables.navButtonBase};
    color: ${props => props.theme.tables.navButtonFontColor}

    :focus {
      outline: none;
    }
    :hover {
      border-bottom: 3px solid ${props => props.theme.tables.navButtonHover};
    }
  `;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0px;
`

const ResetQueryButton = styled.button`
  border-radius: 3px;
  border: none;
  font-size: 80%;
  background-color: transparent;
  :hover{
    font-weight: bold;
    color: ${props => props.theme.tables.resetButton};
  }
  :focus{
    outline: none;
  }
`

interface IResultsContainerProps {
  activeDisplayInResultsTab: string;
  queryResult: any;
  data: any;
  userInputForTables: string;
  activeTableInPanel: any;
  selectedForQueryTables: any;
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
  resetQuerySelection
}) => {

  const listOfTabNames = ['Tables', 'Query Results'];

  const resultsTabs = listOfTabNames.map((tabname) => {
    return <ResultsNavButton
      key={tabname}
      activeDisplayInResultsTab={activeDisplayInResultsTab}
      activetabname={tabname}
      onClick={() => setActiveDisplayInResultsTab(tabname)}
    >{tabname}</ResultsNavButton>
  })

  return (
    <ResultsWrapper>
      <ResultsHeader>
        <ResultsNav>
          {resultsTabs}
        </ResultsNav>
        <ResetQueryButton onClick={resetQuerySelection}>Reset Query</ResetQueryButton>
      </ResultsHeader>
      {activeDisplayInResultsTab === 'Tables' &&
        <TablesContainer
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