import * as React from 'react';
import styled from 'styled-components';
import { Button, Grommet, TextArea } from 'grommet';
import { grommet } from 'grommet/themes';

const OmniBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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
          <TextArea
            resize={false}
            onChange={e => setUserInputQuery(e.target.value)}
            value={userInputQuery}
          />
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
      <TextArea
        resize={false}
        placeholder="Search for a table"
        onChange={e => setUserInputForTables(e.target.value)}
        value={userInputForTables}
      />
    );
  }
};

export default OmniBoxInput;
