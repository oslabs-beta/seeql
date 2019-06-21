import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';

const InvisibleHeader = styled.div`
  height: 30px;
  -webkit-app-region: drag;
`;

const LoginPageWrapper = styled.div`
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  width: 100vw;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: none;
`;

const Panel = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeftPanel = styled(Panel)`
  background-color: #013243;
  color: #f2f1ef;
`;

const RightPanel = styled(Panel)`
  background-color: #f2f1ef;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const LoginTypeNavigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

interface LoginTypeButtonProps {
  readonly selectedLoginType: string;
  readonly buttonType: string;
}

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
      ? '3px solid #013243'
      : '3px solid transparent'};
  transition: 0.3s;
  :hover {
    border-bottom: 3px solid #013243;
    cursor: pointer;
  }
  :focus {
    outline: none;
  }
`;

const URIConnectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const InputLabel = styled.span`
  font-size: 100%;
  letter-spacing: 2px;
`;

interface IURIInputProps {
  requiredError: boolean;
}

const URIInput = styled.textarea<IURIInputProps>`
  width: 200px;
  height: 150px;
  border-radius: 3px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
  resize: none;
  padding: 8px;
  border: ${({ requiredError }) =>
    requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};

  :focus {
    outline: none;
  }
`;

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
  border: ${({ requiredError }) =>
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
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [loggedOutMessage, setLoggedOutMessage] = useState('');
  const [tableData, setTableData] = useState([]);

  const sendLoginURI = (): void => {
    if (loggedOutMessage) setLoggedOutMessage('');
    const updatedPort = !port ? '5432' : port;
    let updatedURI;
    if (loginType === 'URI') updatedURI = URI;
    else if (loginType === 'Credentials')
      updatedURI = `postgres://${username.value}:${password.value}@${host.value}:${updatedPort}/${database.value}`;

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
      ipcRenderer.send('uri-to-main', updatedURI);
    }
  };


  // IPC messaging listeners
  useEffect(() => {
    ipcRenderer.on('db-connection-error', (_event, err) => {
      // #TODO: Error handling for cases where unable to retrieve info from a valid connection
      setConnectionError(true);
      setLoading(false);
    });
    ipcRenderer.on('tabledata-to-login', (_event, databaseTables) => {
      setConnectionError(false);
      setTableData(databaseTables);
      setLoading(false);
      setRedirectToHome(true);
    });
    ipcRenderer.send('login-mounted');
    ipcRenderer.on('logout-reason', (_event, message) => setLoggedOutMessage(message));
    return () => {
      ipcRenderer.removeAllListeners('db-connection-error');
      ipcRenderer.removeAllListeners('tabledata-to-login');
      ipcRenderer.removeAllListeners('logout-reason');
    }
  }, []);

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
      <LoginPageWrapper>
        <LeftPanel>
          <Title>SeeQL</Title>
        </LeftPanel>
        <RightPanel>
          <LoginContainer>
            {loggedOutMessage === 'inactivity' &&
              <LogoutMessage>You've been logged out due to inactivity</LogoutMessage>}
            {loggedOutMessage === 'userlogout' &&
              <LogoutMessage>You logged out</LogoutMessage>}
            {connectionError && (
              <ConnectionErrorMessage>
                Unable to connect to the database. Please try again.
              </ConnectionErrorMessage>
            )}
            <LoginTypeNavigation>
              <LoginTypeButton
                buttonType="URI"
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
              <URIConnectionContainer>
                <InputLabel>URI Connection String</InputLabel>
                <URIInput
                  requiredError={requiredError}
                  onChange={captureURI}
                  placeholder="Enter your URI connection string..."
                  value={URI}
                />
                {requiredError && (
                  <RequiredWarning>URI is required</RequiredWarning>
                )}
              </URIConnectionContainer>
            )}
            <ToggleSSL>
              <input type="checkbox" onChange={e => setSSL(e.target.checked)} />
              <InputLabel>ssl?</InputLabel>
            </ToggleSSL>
            {!loading && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>}
            {loading && <LoginBtn disabled>Loading...</LoginBtn>}
            {redirectHome()}
          </LoginContainer>
        </RightPanel>
      </LoginPageWrapper>
    </React.Fragment>
  );
};

export default Login;
