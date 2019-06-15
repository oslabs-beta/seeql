import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from "electron";

const InvisibleHeader = styled.div`
  height: 30px;
  -webkit-app-region: drag;
`

const FullPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

interface URIInputProps {
  readonly requiredErr: boolean;
}

interface LoginTypeButtonProps {
  readonly selectedLoginType: string;
  readonly buttonType: string;
};

const URIInput = styled.textarea<URIInputProps>`
  width: 200px;
  height: 100px;
  border-radius: 3px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
  resize: none;
  padding: 10px;
  border: ${props =>
    props.requiredErr ? '1px solid #ca333e' : '1px solid lightgrey'};

  :focus {
    outline: none;
  }
`;

const ToggleSSL = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 20px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  color: black;
  align-items: center;
  font-size: 80%;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px;
  height: 400px;
  width: 300px;
  border: 1px solid grey;
`;

const LoginBtn = styled.button`
  padding: 5px 20px;
  font-family: 'Poppins', sans-serif;
`;

const LoginTypeButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  height: 8vh;
`;

const LoginTypeButton = styled.button<LoginTypeButtonProps>`
  padding: 5px 20px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  border: none;
  background-color: white;
  border-bottom: ${props => props.selectedLoginType === props.buttonType ? '3px solid #00b5cc' : '3px solid transparent'};

  :focus {
    outline: none;
  }
`;

const CredentialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const CredentialsInput = styled.input<URIInputProps>`
  border-radius: 1px;
  height: 12vh;
  width: 200px;
  padding-left: 2px;
  margin: .5px;
	border: ${props => props.requiredErr ? '1px solid #ca333e' : '1px solid lightgrey'};
`;

const ConnectionErrorMessage = styled.div`
  background-color: #f1c7ca;
  color: #ca333e;
  border-radius: 3px;
  padding: 10px;
  margin: 5px;
  font-size: 80%;
  font-family: 'Poppins', sans-serif;
  transition: 0.5s;
`;

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 60%;
`;

const InputLabel = styled.span`
  color: black;
  font-family: "Poppins", sans-serif;
`;

const URIConnectionStringForm = styled.div`
  display: flex;
  flex-direction: column;
  height: 150px;
`

const Login = () => {


  const [loginType, setLoginType] = useState('URI');
  const [host, setHost] = useState({ value: '', requiredError: false });
  const [port, setPort] = useState('5432');
  const [username, setUsername] = useState({ value: '', requiredError: false });
  const [password, setPassword] = useState({ value: '', requiredError: false });
  const [database, setDatabase] = useState({ value: '', requiredError: false });
  const [URI, setURI] = useState('');
  const [isSSL, setSSL] = useState(false);

  const [requiredError, setRequiredError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [tableData, setTableData] = useState([]);

  const sendLoginURI = (): void => {
    // if (connectionError) setConnectionError(false);
    let updatedPort = !port ? '5432' : port;
    let updatedURI;
    if (loginType === 'URI') updatedURI = URI;
    else if (loginType === 'Credentials') updatedURI = `postgres://${username.value}:${password.value}@${host.value}:${updatedPort}/${database.value}`

    if (isSSL) updatedURI += '?ssl=true';

    if (!updatedURI) setRequiredError(true);
    if (!host.value) setHost({ value: '', requiredError: true });
    if (!username.value) setUsername({ value: '', requiredError: true });
    if (!password.value) setPassword({ value: '', requiredError: true });
    if (!database.value) setDatabase({ value: '', requiredError: true });

    if (
      URI ||
      (host.value && username.value && password.value && database.value)
    ) {
      setLoading(true);
      ipcRenderer.send("uri-to-main", updatedURI);
    }
 
  };

  ipcRenderer.removeAllListeners("db-connection-error")
  ipcRenderer.on("db-connection-error", (event, err) => {
    // #TODO: Error handling for cases where unable to retrieve info from a valid connection
    setConnectionError(true);
    setLoading(false);
  });
  
  ipcRenderer.removeAllListeners("tabledata-to-login")
  ipcRenderer.on("tabledata-to-login", (event, databaseTables) => {
    setConnectionError(false);
    setTableData(databaseTables);
    setLoading(false);
    setRedirectToHome(true);
  });

  const captureURI = (e): void => {
    const sanitizedURI = e.target.value.replace(/\s+/g, '');
    setURI(sanitizedURI);
    if (requiredError) setRequiredError(false);
  };

  const redirectHome = () => {
    if (redirectToHome)
      return (
        <Redirect
          to={{ pathname: '/homepage', state: { tables: tableData } }}
        />
      );
  };



  return (
    <React.Fragment>
    <InvisibleHeader></InvisibleHeader>
    <FullPageWrapper>

    <LoginContainer>

      {connectionError
        && <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage>
      }


      <LoginTypeButtonContainer>
        <LoginTypeButton
          buttonType="URI"
          selectedLoginType={loginType}
          onClick={() => setLoginType('URI')}
        >
          URI
        </LoginTypeButton>
        <LoginTypeButton
          buttonType="Credentials"
          selectedLoginType={loginType}
          onClick={() => setLoginType('Credentials')}
        >
          Credentials
        </LoginTypeButton>
      </LoginTypeButtonContainer>

      {loginType === 'Credentials' &&
        <CredentialsContainer>
          <CredentialsInput type="text"
            requiredErr={host.requiredError}
            placeholder="host"
            onChange={(e) => setHost({ value: e.target.value, requiredError: false })}
          />
          <CredentialsInput type="text"
            requiredErr={false}
            placeholder="port (default 5432)"
            onChange={(e) => setPort(e.target.value)}
          />
          <CredentialsInput type="text"
            requiredErr={username.requiredError}
            placeholder="username"
            onChange={(e) => setUsername({ value: e.target.value, requiredError: false })}
          />
          <CredentialsInput type="text"
            requiredErr={password.requiredError}
            placeholder="password"
            onChange={(e) => setPassword({ value: e.target.value, requiredError: false })}
          />
          <CredentialsInput type="text"
            requiredErr={database.requiredError}
            placeholder="database"
            onChange={(e) => setDatabase({ value: e.target.value, requiredError: false })}
          />
          {(host.requiredError || username.requiredError || password.requiredError || database.requiredError)
            && <RequiredWarning>This field is required</RequiredWarning>
          }
        </CredentialsContainer>
      }
      {loginType === 'URI' &&
      <URIConnectionStringForm>
          <InputLabel>
            URI Connection String
          </InputLabel>
          <URIInput
            requiredErr={requiredError}
            onChange={captureURI}
            placeholder="Enter your URI connection string..."
          />
        </URIConnectionStringForm>
      }
      {requiredError &&
        <RequiredWarning>This field is required</RequiredWarning>}

      <ToggleSSL>
        <input type="checkbox" onChange={(e) => setSSL(e.target.checked)} />
        <label>ssl?</label>
      </ToggleSSL>

      {!isLoading && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>}
      {isLoading && <LoginBtn disabled>Loading...</LoginBtn>}

      {redirectHome()}
    </LoginContainer>
    </FullPageWrapper>
    </React.Fragment>
  );
};

export default Login;
