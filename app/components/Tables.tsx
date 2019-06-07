import * as React from 'react';
import { Component, Fragment } from 'react';
import styled from 'styled-components';

const TableWrapper = styled.table`
  height: 100%;
  color: black;
`;

type Props = {
  key: string;
  tableName: string;

  columns: Array<string>;
};

export default class Tables extends Component<Props> {
  render() {
    let arrOfColumns = [];
    let arrOfTypes = [];
    for (let keys in this.props.columns) {
      arrOfColumns.push(this.props.columns[keys]['columnname']);
      arrOfTypes.push(this.props.columns[keys]['datatype']);
    }

    return (
      <Fragment>
        <TableWrapper>
          <caption>{this.props.tableName}</caption>
          <thead>
            <tr>
              <th>{arrOfColumns}</th>
              <th>column!</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{arrOfTypes}</td>
              <td>data2</td>
            </tr>
          </tbody>
        </TableWrapper>
      </Fragment>
    );
  }
}
