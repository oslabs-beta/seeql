import * as React from 'react';

export default class App extends React.Component {
  public render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}
