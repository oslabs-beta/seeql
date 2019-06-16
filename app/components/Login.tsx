import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { ipcRenderer } from "electron";

const InvisibleHeader = styled.div`
  height: 30px;
  -webkit-app-region: drag;
`

const LoginPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  width: 100vw;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  padding: 20px;
  width: 300px;
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
};


const LoginTypeButton = styled.button<LoginTypeButtonProps>`
  padding: 5px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  border: none;
  background-color: white;
  border-bottom: ${({selectedLoginType, buttonType}) => selectedLoginType === buttonType ? '3px solid #00b5cc' : '3px solid transparent'};

  :focus {
    outline: none;
  }
`;

const URIConnectionContainer= styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const InputLabel = styled.span`
  font-size: 60%;
  letter-spacing:2px;
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
  border: ${({requiredError}) =>
    requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};

  :focus{
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
  font-size: 100%;
  :hover{
    color: white;
    background-color: #1EA196;
  }
  :focus{
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
`

const CredentialsInput = styled.input<IURIInputProps>`
  border-radius: 3px;
  padding: 8px;
  width: 200px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
	border: ${({requiredError}) => requiredError ? '1px solid #ca333e' : '1px solid lightgrey'};
  :focus{
    outline: none;
  }
`;

const ConnectionErrorMessage = styled.div`
  background-color: #f1c7ca;
  color: #ca333e;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
  font-family: 'Poppins', sans-serif;
  transition: 0.5s;
`;

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 60%;
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
  const [isLoading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [tableData, setTableData] = useState([]);

  const sendLoginURI = (): void => {
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
      <LoginPageWrapper>
        <LoginContainer>
        {connectionError && 
          <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage>
        }
        <LoginTypeNavigation>
          <LoginTypeButton
            buttonType="URI"
            selectedLoginType={loginType}
            onClick={() => {setLoginType('URI'), setConnectionError(false)}}
          >
          URI
          </LoginTypeButton>
          <LoginTypeButton
            buttonType="Credentials"
            selectedLoginType={loginType}
            onClick={() => {setLoginType('Credentials'), setConnectionError(false)}}
          >
          Credentials
          </LoginTypeButton>
      </LoginTypeNavigation>
      {loginType === 'Credentials' &&
        <CredentialsContainer>
          <InputAndLabelWrapper>
            <InputLabel>
              Host
            </InputLabel>
            <CredentialsInput type="text"
              requiredError={host.requiredError}
              placeholder="host"
              onChange={(e) => setHost({ value: e.target.value, requiredError: false })}
            />
            {host.requiredError && 
            <RequiredWarning>host is required</RequiredWarning>
            }
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>
              Port
            </InputLabel>
            <CredentialsInput type="text"
              requiredError={false}
              placeholder="port (default 5432)"
              onChange={(e) => setPort(e.target.value)}
            />
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>
              Username
            </InputLabel>
            <CredentialsInput type="text"
              requiredError={username.requiredError}
              placeholder="username"
              onChange={(e) => setUsername({ value: e.target.value, requiredError: false })}
            />
            {username.requiredError && 
            <RequiredWarning>username is required</RequiredWarning>
            }
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>
              Password
            </InputLabel>
            <CredentialsInput type="password"
              requiredError={password.requiredError}
              placeholder="password"
              onChange={(e) => setPassword({ value: e.target.value, requiredError: false })}
            />
            {password.requiredError && 
            <RequiredWarning>password is required</RequiredWarning>
            }
          </InputAndLabelWrapper>
          <InputAndLabelWrapper>
            <InputLabel>
              Database
            </InputLabel>
            <CredentialsInput type="text"
              requiredError={database.requiredError}
              placeholder="database"
              onChange={(e) => setDatabase({ value: e.target.value, requiredError: false })}
            />
            {database.requiredError && 
            <RequiredWarning>database is required</RequiredWarning>
            }
          </InputAndLabelWrapper>
        </CredentialsContainer>
      }
      {loginType === 'URI' &&
        <URIConnectionContainer>
          <InputLabel>
            URI Connection String
          </InputLabel>
          <URIInput
            requiredError={requiredError}
            onChange={captureURI}
            placeholder="Enter your URI connection string..."
          />
          {requiredError &&
          <RequiredWarning>This field is required</RequiredWarning>}
        </URIConnectionContainer> 
      }
      <ToggleSSL>
        <input type="checkbox" onChange={(e) => setSSL(e.target.checked)} />
        <label>ssl?</label>
      </ToggleSSL>
      {!isLoading && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>}
      {isLoading && <LoginBtn disabled>Loading...</LoginBtn>}
      {redirectHome()}
    </LoginContainer>
  </LoginPageWrapper>
</React.Fragment>
)};

export default Login;
