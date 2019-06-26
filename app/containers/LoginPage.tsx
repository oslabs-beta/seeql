import * as React from 'react';
import Login from '../components/Login';

interface Props {
  setTableData: (any) => any;
  setCurrentView: (any) => any;
}

const LoginPage: React.SFC<Props> = ({ setTableData, setCurrentView }) =>
  <Login setTableData={setTableData} setCurrentView={setCurrentView} />;

export default LoginPage;