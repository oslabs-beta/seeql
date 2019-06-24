import * as React from 'react';
import styled from 'styled-components';
import { Button, Grommet } from 'grommet';
import { grommet } from 'grommet/themes';

const OmniBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OmniBoxInputText = styled.textarea`
  font-family: 'Poppins', sans-serif;
  border: 1px solid lightgrey;
  padding: 8px;
  height: 100px;
  border-radius: 3px;
  letter-spacing: 2px;
  resize: none;
  width: 100%;

  :focus {
    outline: none;
  }
`;

// const ExecuteQueryButton = styled.button`
//   font-family: 'Poppins', sans-serif;
//   background-color: 'black';
//   transition: 0.2s;
//   color: 'black';
//   text-align: center;
//   padding: 5px;
//   font-size: 80%;
//   transition: 1s;

//   :hover {
//     background-image: linear-gradient(to bottom right, #49cefe, #c647bc);
//   }

//   :focus {
//     outline: none;
//   }
// `;

interface IOmniBoxInputProps {
  userInputQuery: string;
  loadingQueryStatus: boolean;
  userInputForTables: string;
  tabname: string;
  setUserInputQuery: (any) => any;
  executeQuery: (any) => any;
  setUserInputForTables: (any) => any;
}

const OmniBoxInput: React.SFC<IOmniBoxInputProps> = ({
  setUserInputQuery,
  userInputQuery,
  executeQuery,
  loadingQueryStatus,
  setUserInputForTables,
  userInputForTables,
  tabname
}) => {
  if (tabname === 'SQL') {
    return (
      <Grommet theme={grommet}>
        <OmniBoxWrapper>
          <OmniBoxInputText
            onChange={e => setUserInputQuery(e.target.value)}
            value={userInputQuery}
          ></OmniBoxInputText>
          <Button
            onClick={executeQuery}
            disabled={loadingQueryStatus}
            label={loadingQueryStatus ? 'Loading query results...' : 'Execute Query'}
          />
        </OmniBoxWrapper>
      </Grommet>
    );
  }
  if (tabname === 'plain') {
    return (
      <OmniBoxInputText
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
        value={userInputForTables}
      ></OmniBoxInputText>
    );
  }
};

export default OmniBoxInput;
