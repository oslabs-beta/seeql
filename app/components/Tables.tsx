import * as React from 'react';
import styled from 'styled-components';

// import { useState, useEffect } from 'react';
const TableWrapper = styled.table`
  height: 100%;
  color: black;
`;

const Tables = () => {
  //RENDER A TABLES USING
  //props....
  return (
    <div>
      <TableWrapper>
        <thead>
          <tr>
            <th>name</th>
            <th>name</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>blah</td>
            <td>blah</td>
            <td>blah</td>
          </tr>
        </tbody>
      </TableWrapper>
    </div>
  );
};

export default Tables;
