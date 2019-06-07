import * as React from 'react';
import { Component, Fragment } from 'react';
import styled from 'styled-components';

const TableWrapper = styled.ul`
  color: black;
  display: grid;
  grid-gap: 20px 20px;
  grid-auto-rows: auto;
  grid-auto-columns: minmax(100px, auto);
`;

const DivWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
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
      arrOfColumns.push(<li>{this.props.columns[keys]['columnname']}</li>);
      arrOfTypes.push(<li>{this.props.columns[keys]['datatype']} </li>);
    }

    return (
      <Fragment>
        <TableWrapper>
          <caption>{this.props.tableName}</caption>
          <DivWrapper className="columns">
            <li>{arrOfColumns}</li>
            <li>{arrOfTypes}</li>
          </DivWrapper>
        </TableWrapper>
      </Fragment>
    );
  }
}
