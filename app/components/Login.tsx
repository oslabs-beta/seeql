import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import { CheckBox, Grommet, Box, Button, Text, Tab, Tabs, Heading, TextArea } from 'grommet';
import { grommet } from 'grommet/themes';
import { Login as LoginIcon } from 'grommet-icons';

const myTheme = {
  global: {
    // changes here will affect more than one component at a time
  },
  anchor: {
    // changes here will affect Anchor component only
  }
};

const funtimes = keyframes`
 0%{background-position:0% 50%}
 50%{background-position:100% 50%}
 100%{background-position:0% 50%}
 `;

const Gradient = styled.div`
 backgroundColor:white;
 animation:${funtimes} 8s ease infinite;
 background:linear-gradient(270deg, #49cefe, #c647bc);
`
const InputLabel = styled.span`
  font-size: 100%;
  letter-spacing: 2px;
`;

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 80%;
`;
interface IURIInputProps {
  requiredError: boolean;
}


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
  border: ${({ requiredError }) => requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};
  :focus {
    outline: none;
  }
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
    const updatedPort: string = !port ? '5432' : port;
    let updatedURI: string;

    if (loggedOutMessage) setLoggedOutMessage('');
    if (loginType === 'URI') updatedURI = URI
    if (loginType === 'Credentials') {
      updatedURI = `postgres://
        ${username.value}:
        ${password.value}@
        ${host.value}:
        ${updatedPort}/
        ${database.value}`;
    }

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
    ipcRenderer.on('db-connection-error', () => {
      // #TODO: Error handling for cases where unable to retrieve info from a valid connection
      setConnectionError(true);
      setLoading(false);
    });
    ipcRenderer.on('tabledata-to-login', (_: void, databaseTables: React.SetStateAction<any[]>) => {
      setConnectionError(false);
      setTableData(databaseTables);
      setLoading(false);
      setRedirectToHome(true);
    });
    ipcRenderer.send('login-mounted');
    ipcRenderer.on('logout-reason', (_: void, message: React.SetStateAction<string>) =>
      setLoggedOutMessage(message)
    );
    return () => {
      ipcRenderer.removeAllListeners('db-connection-error');
      ipcRenderer.removeAllListeners('tabledata-to-login');
      ipcRenderer.removeAllListeners('logout-reason');
    };
  }, []);

  const sanitizeURI = (e: React.FormEvent<HTMLInputElement>): void => {
    setURI(e.target.value.replace(/\s+/g, ''))
    if (requiredError) setRequiredError(false);
  };

  const redirectHome = () => {
    if (redirectToHome)
      return (<Redirect to={{ pathname: '/homepage', state: { tables: tableData } }} />);
  };

  return (
    <Grommet full theme={grommet}>
      <Box background={Gradient} justify="center">
        <Box width="medium" justify="center" alignSelf="center">
          <Heading
            margin="xxsmall"
            level="1"
            responsive={true}
            size="xlarge"
            textAlign="center"
            truncate={false}>SeeQL</Heading>
          {loggedOutMessage === 'inactivity' && (
            <Text>
              You've been logged out due to inactivity
            </Text>
          )}
          {loggedOutMessage === 'userlogout' && (
            <LogoutMessage>You logged out</LogoutMessage>
          )}
          {connectionError && (
            <Box
              color="status-error">
              Unable to connect to the database. Please try again.
            </Box>
          )}
          <Tabs>
            <Tab
              margin="large"
              title="URI"
              selectedLoginType={loginType}
              onClick={() => { setLoginType('URI'), setConnectionError(false); 
              }}>
            <URIInput
              requiredError={requiredError}
              onChange={sanitizeURI}
              placeholder="Enter your URI connection string..."
              value={URI} 
            />
             {requiredError && (
	             <RequiredWarning>URI is required</RequiredWarning>
             )}
            </Tab>


            <Tab
              title="Credentials"
              selectedLoginType={loginType}
              onClick={() => { setLoginType('Credentials'), setConnectionError(false); }}>
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
                  {database.requiredError && (<RequiredWarning>database is required</RequiredWarning>)}
                </InputAndLabelWrapper>
              </CredentialsContainer>
            </Tab>
          </Tabs>

         <ToggleSSL>
            <input type="checkbox" onChange={e => setSSL(e.target.checked)} />
            <InputLabel>ssl?</InputLabel>
          </ToggleSSL>

          {!loading && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>}
	        {loading && <LoginBtn disabled>Loading...</LoginBtn>}
          {redirectHome()}
        </Box>
        {/* end box that wraps the entire fill */}
      </Box>
      {/* end Grommet provider */}
    </Grommet >
  );
};

export default Login;
