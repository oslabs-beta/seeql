import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { ipcRenderer } from 'electron';
import { Grommet, Box, TextArea, Button } from 'grommet';
import { grommet } from 'grommet/themes';

const LoginTypeNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LoginTypeButton = styled.button<LoginTypeButtonProps>`
  padding: 5px;
  font-size: 140%;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  background-color: transparent;
  display: flex;
  border: none;
  border-bottom: ${({ selectedLoginType, buttonType }) =>
    selectedLoginType === buttonType
      ? '3px solid #E55982'
      : '3px solid transparent'};
  transition: 0.3s;
  :hover {
    border-bottom: 3px solid #e55982;
    cursor: pointer;
  }
  :focus {
    outline: none;
  }
`;

interface LoginTypeButtonProps {
  readonly selectedLoginType: string;
  readonly buttonType: string;
}

const InputLabel = styled.span`
  font-size: 100%;
  letter-spacing: 2px;
`;

interface IURIInputProps {
  requiredError: boolean;
}

const ToggleSSL = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  margin: 10px;
  display: flex;
  align-items: center;
`;

const LoginBtn = styled.button`
  padding: 5px;
  border-radius: 3px;
  font-family: 'Poppins', sans-serif;
  width: 100px;
  border: none;
  transition: 0.2s;
  font-size: 120%;
  :hover {
    color: white;
    background-color: #1ea196;
  }
  :focus {
    outline: none;
  }
`;

const CredentialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const InputAndLabelWrapper = styled.div`
  margin: 5px 0px;
  display: flex;
  flex-direction: column;
`;

const CredentialsInput = styled.input<IURIInputProps>`
  border-radius: 3px;
  padding: 8px;
  width: 200px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
  // border: ${({ requiredError }) =>
    requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};
  :focus {
    outline: none;
  }
`;

const ConnectionErrorMessage = styled.div`
  background-color: #f1c7ca;
  width: 200px;
  color: #ca333e;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
  font-family: 'Poppins', sans-serif;
  border-left: 3px solid #ca333e;
  font-size: 100%;
`;

const LogoutMessage = styled.div`
  background-color: #f1c7ca;
  width: 200px;
  color: #ca333e;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
  font-family: 'Poppins', sans-serif;
  border-left: 3px solid #ca333e;
  font-size: 100%;
`;

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 80%;
`;

const ToggleRememberMe = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  margin: 10px;
  display: flex;
  align-items: center;
`;

const LoginComponent = () => {
  const [URI, setURI] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [username, setUsername] = useState({ value: '', requiredError: false });
  const [password, setPassword] = useState({ value: '', requiredError: false });
  const [database, setDatabase] = useState({ value: '', requiredError: false });
  const [host, setHost] = useState({ value: '', requiredError: false });
  const [port, setPort] = useState('5432');
  const [loginType, setLoginType] = useState('URI');
  const [isSSL, setSSL] = useState(false);
  const [requiredError, setRequiredError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedOutMessage, setLoggedOutMessage] = useState('');
  const [tableData, setTableData] = useState([]);

  const [connectionName, setConnectionName] = useState('');
  const [saveConnection, setSaveConnection] = useState(false);

  // const [userHasSavedConnStrs, setUserHasSavedConnStrs] = useState(false);
  const sendLoginURI = (): void => {
    if (loggedOutMessage) setLoggedOutMessage('');

    const updatedPort = !port ? '5432' : port;
    let updatedURI;

    if (loginType === 'URI') updatedURI = URI;
    else if (loginType === 'Credentials') updatedURI = `postgres://${username.value}:${password.value}@${host.value}:${updatedPort}/${database.value}`;
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
  
     
      if (saveConnection) {
        setLoading(true);
        ipcRenderer.send('uri-to-main', updatedURI);
        ipcRenderer.send('remember-connection', JSON.stringify({ 
          connectionName: connectionName,
          connectionString: updatedURI
        })
        )
      }
    }
  };

  ipcRenderer.on('db-connection-error', () => {
    setConnectionError(true);
    setLoading(false);
  });

  // IPC messaging listeners
  useEffect(() => {
    ipcRenderer.on(
      'tabledata-to-login',
      (_event: Event, databaseTables: string[]) => {
        setConnectionError(false);
        setTableData(databaseTables);
        setLoading(false);
        setRedirectToHome(true);
      }
    );
    ipcRenderer.on(
      'tabledata-to-login',
      (_event: Event, databaseTables: string[]) => {
        setConnectionError(false);
        setTableData(databaseTables);
        setLoading(false);
        setRedirectToHome(true);
      }
    );
    ipcRenderer.send('login-mounted');
    ipcRenderer.on('logout-reason', (_event, message) =>
      setLoggedOutMessage(message)
    );
    // #TODO: render saved connections as <li>s
    // ipcRenderer.on('saved-connection-strings', data);
    return () => {
      ipcRenderer.removeAllListeners('db-connection-error');
      ipcRenderer.removeAllListeners('tabledata-to-login');
      ipcRenderer.removeAllListeners('tabledata-to-login');
      ipcRenderer.removeAllListeners('logout-mounted');
      ipcRenderer.removeAllListeners('logout-reason');
    };
  }, []);

  const captureURI = (e: any) => {
    const sanitizedURI = e.target.value.replace(/\s+/g, '');
    setURI(sanitizedURI);
    if (requiredError) setRequiredError(false);
  };

  const captureConnectionName = (e: any) => {
    const connectionToSave = e.target.value
    setSaveConnection(true);
    return setConnectionName(connectionToSave)
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
    <Grommet theme={grommet}>
      {loggedOutMessage === 'inactivity' && (
        <LogoutMessage>You've been logged out due to inactivity</LogoutMessage>
      )}
      {loggedOutMessage === 'userlogout' && (
        <LogoutMessage>You logged out</LogoutMessage>
      )}
      {connectionError && (
        <ConnectionErrorMessage>
          Unable to connect to the database. Please try again.
        </ConnectionErrorMessage>
      )}
      <LoginTypeNavigation>
        <LoginTypeButton
          buttonType="URI"
          required
          selectedLoginType={loginType}
          onClick={() => {
            setLoginType('URI'), setConnectionError(false);
          }}
        >
          URI
        </LoginTypeButton>

        <LoginTypeButton
          buttonType="Credentials"
          selectedLoginType={loginType}
          onClick={() => {
            setLoginType('Credentials'), setConnectionError(false);
          }}
        >
          Credentials
        </LoginTypeButton>
      </LoginTypeNavigation>

      {loginType === 'Credentials' && (
        <CredentialsContainer>
          <InputAndLabelWrapper>
            <InputLabel>Host</InputLabel>
            <CredentialsInput
              type="text"
              requiredError={host.requiredError}
              placeholder="host"
              value={host.value}
              onChange={e =>
                setHost({ value: e.target.value, requiredError: false })
              }
            />
            {host.requiredError && (
              <RequiredWarning>host is required</RequiredWarning>
            )}
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>Port</InputLabel>
            <CredentialsInput
              type="text"
              requiredError={false}
              placeholder="port (default 5432)"
              value={port}
              onChange={e => setPort(e.target.value)}
            />
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>Username</InputLabel>
            <CredentialsInput
              type="text"
              requiredError={username.requiredError}
              placeholder="username"
              value={username.value}
              onChange={e =>
                setUsername({
                  value: e.target.value,
                  requiredError: false
                })
              }
            />
            {username.requiredError && (
              <RequiredWarning>username is required</RequiredWarning>
            )}
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>Password</InputLabel>
            <CredentialsInput
              type="password"
              requiredError={password.requiredError}
              placeholder="password"
              value={password.value}
              onChange={e =>
                setPassword({
                  value: e.target.value,
                  requiredError: false
                })
              }
            />
            {password.requiredError && (
              <RequiredWarning>password is required</RequiredWarning>
            )}
            <p>#TODO: add remember here too</p>
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>Database</InputLabel>
            <CredentialsInput
              type="text"
              requiredError={database.requiredError}
              placeholder="database"
              value={database.value}
              onChange={e =>
                setDatabase({
                  value: e.target.value,
                  requiredError: false
                })
              }
            />
            {database.requiredError && (
              <RequiredWarning>database is required</RequiredWarning>
            )}
          </InputAndLabelWrapper>
        </CredentialsContainer>
      )}

      {loginType === 'URI' && (
        <Box>
          <TextArea
            requiredError={requiredError}
            onChange={captureURI}
            value={URI}
            required
            placeholder="Enter your URI connection string..."
          />

          <ToggleSSL>
            <input type="checkbox" onChange={e => setSSL(e.target.checked)} />
            <InputLabel>ssl?</InputLabel>
          </ToggleSSL>

          {/* must give a name to their connection only if they want to save it */}
          {saveConnection && (
            <TextArea
              onChange={captureConnectionName}
              value={connectionName}
              placeholder="give a name for your connection"
            />
          )}
        </Box>
      )}

      <ToggleRememberMe>
        <input
          type="checkbox"
          onChange={e => setSaveConnection(e.target.checked)}
        />
        <InputLabel>remember this connection?</InputLabel>
      </ToggleRememberMe>

      {!loading && <Button onClick={sendLoginURI}>Login</Button>}
      {loading && <LoginBtn disabled>Loading...</LoginBtn>}
      {redirectHome()}
      {/* {savedConnectionStrings.map()} */}
    </Grommet>
  );
};

export default LoginComponent;
