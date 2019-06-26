import * as React from 'react';
import Login from '../components/Login';

interface Props {
  setTableData: (any) => any;
  setCurrentView: (any) => any;
  // pgClient: any;
  setPgClient: (any) => any;
}

const LoginPage: React.SFC<Props> = ({ setTableData, setCurrentView, setPgClient }) =>
  <Login 
    setTableData={setTableData} 
    setCurrentView={setCurrentView}
    setPgClient={setPgClient}  
  />;

export default LoginPage;