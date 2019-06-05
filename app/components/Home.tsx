import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
const routes = require('../constants/routes.json');
const styles = require('./Home.css');

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
