import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import { CheckBox, Grommet, Box, Button, Text, Tab, Tabs, Heading, TextArea } from 'grommet';
import { dark } from 'grommet/themes';
import { Login as LoginIcon } from 'grommet-icons';

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

// const InvisibleHeader = styled.div`
//   height: 30px;
//   -webkit-app-region: drag;
// `;
//

// interface LoginTypeButtonProps {
//   readonly selectedLoginType: string;
//   readonly buttonType: string;
// }
// const LoginTypeButton = styled.button<LoginTypeButtonProps>`
//  border-bottom: ${({
//    selectedLoginType, buttonType
//  }) => selectedLoginType === buttonType ? '1 px black' : '1 px gray'};
// `;

const InputLabel = styled.span`
  font-size: 100%;
  letter-spacing: 2px;
`;

interface IURIInputProps {
  requiredError: boolean;
}

// const URIInput = styled.textarea<IURIInputProps>`
//   width: 200px;
//   height: 150px;
//   border-radius: 3px;
//   font-family: 'Poppins', sans-serif;
//   letter-spacing: 2px;
//   resize: none;
//   padding: 8px;
//   border: ${({ requiredError }) =>
//     requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};
//
//   :focus {
//     outline: none;
//   }
// `;

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

// const ConnectionErrorMessage = styled.div`
//   background-color: #f1c7ca;
//   width: 200px;
//   color: #ca333e;
//   border-radius: 3px;
//   padding: 5px;
//   margin: 5px;
//   font-family: 'Poppins', sans-serif;
//   border-left: 3px solid #ca333e;
//   font-size: 100%;
// `;

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
  //const [isSSL, setSSL] = useState(false);
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
    else if (loginType === 'Credentials') updatedURI = `
      postgres://${username.value}:
                 ${password.value}@
                 ${host.value}:
                 ${updatedPort}/
                 ${database.value}`;

    // if (isSSL) updatedURI += '?ssl=true';

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
    ipcRenderer.on('logout-reason', (_event, message) =>
      setLoggedOutMessage(message)
    );
    return () => {
      ipcRenderer.removeAllListeners('db-connection-error');
      ipcRenderer.removeAllListeners('tabledata-to-login');
      ipcRenderer.removeAllListeners('logout-reason');
    };
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

    <Grommet theme={dark}>
      <Box background={Gradient} fill justify="center">
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
              title="URI"
              // selectedLoginType={loginType}
              onClick={() => { setLoginType('URI'), setConnectionError(false); }}>
              <Box pad="medium"></Box>
            </Tab>

            <Tab title="Credentials"
              // selectedLoginType={loginType}
              onClick={() => { setLoginType('Credentials'), setConnectionError(false); }}>
              <Box pad="medium"></Box>
            </Tab>
          </Tabs>

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
            <Box>
              <Heading size="small">URI Connection String</Heading>
              <TextArea
                requiredError={requiredError}
                onChange={captureURI}
                placeholder="Enter your URI connection string..."
                value={URI}
              />
              {requiredError && (
                <RequiredWarning>URI is required</RequiredWarning>
              )}
            </Box>
          )}

          <Box align="center" pad="large">
            <CheckBox
              onChange={() => console.log(true)}
            />
            SSL?
          </Box>

          {!loading ?
            (
              <Button
                icon={<LoginIcon />}
                label="Edit"
                onClick={sendLoginURI}>
              </Button>
            ) : (
              <Button
                icon={<LoginIcon />}
                label="Edit"
                onClick={sendLoginURI}>
              </Button>
            )
          }

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
