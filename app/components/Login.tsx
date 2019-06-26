import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
// import { ipcRenderer } from 'electron';
/* eslint-disable @typescript-eslint/no-var-requires */
import { Client } from 'pg';



const getTables = (client) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name ASC`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

const getForeignKeys = (client, tableName) => {
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT tc.table_schema,
                         tc.constraint_name,
                         tc.table_name,
                         kcu.column_name,
                         ccu.table_schema AS foreign_table_schema,
                         ccu.table_name AS foreign_table_name,
                         ccu.column_name AS foreign_column_name
                  FROM information_schema.table_constraints AS tc
                  JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                  JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
                  WHERE tc.constraint_type = 'FOREIGN KEY'
                  AND tc.table_name = '${tableName}'`,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      }
    );
  });
};

// #TODO: add error handling when tables lack a primary key
// Relational database theory dictates that every table must have a primary key.
// This rule is not enforced by PostgreSQL, but it is usually best to follow it.
const getColumns = (client, tableName) => {
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT COLUMN_NAME AS ColumnName,
                             DATA_TYPE AS DataType,
                             CHARACTER_MAXIMUM_LENGTH AS CharacterLength,
                             COLUMN_DEFAULT AS DefaultValue
                      FROM INFORMATION_SCHEMA.COLUMNS
                      WHERE TABLE_NAME = '${tableName}'`,
      (err, result) => {
        if (err)
          // #TODO: give a msg that doesn't expose structure of database
          reject(err);
        resolve(result.rows);
      }
    );
  });
};

const getPrimaryKey = (client, tableName) => {
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT column_name
                      FROM pg_constraint, information_schema.constraint_column_usage
                      WHERE contype = 'p'
                      AND information_schema.constraint_column_usage.table_name = '${tableName}'
                      AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0].column_name);
      }
    );
  });
};
async function composeTableData(client) {
  const tablesArr = [];
  let tableNames: any
  tableNames = await getTables(client);

  for (const table of tableNames.rows) {
    table.primaryKey = await getPrimaryKey(client, table.table_name);
    table.foreignKeys = await getForeignKeys(client, table.table_name);
    table.columns = await getColumns(client, table.table_name);
    tablesArr.push(table);
  }

  return new Promise((resolve, reject) => {
    if (tablesArr.length > 0) {
      resolve(tablesArr);
    } else {
      // #TODO: add empty state trigger
      reject(new Error('database empty'));
    }
  });
}

const InvisibleHeader = styled.div`
  height: 30px;
  -webkit-app-region: drag;
`;
const LoginPageWrapper = styled.div`
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
const Title = styled.h1`
  font-size: 600%;
  font-weight: none;
  color: #485360;
  color: white;
`;
const Panel = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const funtimes = keyframes`
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
`;
const LeftPanel = styled(Panel)`
  background-color: white;
  display: flex;
  width: 100vw;
  height: 100vh;
  animation: ${funtimes} 8s ease infinite;
  background: linear-gradient(270deg, #49cefe, #c647bc);
  background-size: 400% 400%;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 3px;
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
  font-size: 120%;
  margin: 10px;
  background-color: transparent;
  display: flex;
  border: none;
  border-bottom: ${({ selectedLoginType, buttonType }) =>
    selectedLoginType === buttonType
      ? '3px solid #4B70FE '
      : '3px solid transparent'};
  transition: 0.3s;
  :hover {
    border-bottom: 3px solid #4B70FE;
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
    transition: all 0.2s;
`;
const InputLabel = styled.span`
  font-size: 80%;
  letter-spacing: 2px;
  color: #485360;
`;
interface IURIInputProps {
  requiredError: boolean;
}
const URIInput = styled.textarea<IURIInputProps>`
  width: 200px;
  height: 150px;
  border-radius: 3px;
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
  padding-bottom: 10px;
  display: flex;
  align-items: center;
`;

const LoginBtn = styled.button`
  padding: 8px;
  width: 150px;
  border: none;
  transition: 0.2s;
  border-radius: 3px;
  font-size: 120%;
  color: white;
  text-align: center;
  background-color: #4B70FE;
  transition: all 0.2s;
  span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }
  span:after {
    content: ">>";
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }
  :hover {
    box-shadow: 0px 5px 10px #bdc3c7;
    span {
      padding-right: 5px;
    }
    span:after {
    opacity: 1;
    }
  }
  :focus {
    outline: none;
  }
  :active{
    transform: translateY(3px);
    box-shadow: 0px 2px 10px #bdc3c7;
  }
`
const CredentialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
    transition: all 0.2s;
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
  border-left: 3px solid #ca333e;
  font-size: 100%;
    transition: all 0.2s;
`;
const LogoutMessage = styled.div`
  background-color: #d5f5e3;
  width: 200px;
  color: #26a65b;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
  border-left: 3px solid #26a65b;
  font-size: 100%;
    transition: all 0.2s;
`;
const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 80%;
    transition: all 0.2s;
`;

const Login = ({ setTableData, setCurrentView, pgClient, setPgClient }) => {
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
  const [loggedOutMessage, setLoggedOutMessage] = useState('');
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
      // const client = new Client(`postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true`)
      const client = new Client(updatedURI);
      client.connect();
      setPgClient(client)
      composeTableData(client)
        .then(tableData => {
          setTableData(tableData)
          setCurrentView('homePage')
        })
    }
  };

  const captureURI = (e): void => {
    const sanitizedURI = e.target.value.replace(/\s+/g, '');
    setURI(sanitizedURI);
    if (requiredError) setRequiredError(false);
  };
  return (
    <React.Fragment>
      <InvisibleHeader></InvisibleHeader>
      <LoginPageWrapper>
        <LeftPanel>
          <Panel>
            <Title>SeeQL</Title>
          </Panel>
          <Panel>
            <LoginContainer>
              {loggedOutMessage === 'inactivity' && (
                <LogoutMessage>
                  You've been logged out due to inactivity. Please re-enter your credentials to login.
              </LogoutMessage>
              )}
              {loggedOutMessage === 'userlogout' && (
                <LogoutMessage>You have successfully logged out. Have a nice day.</LogoutMessage>
              )}
              {connectionError && (
                <ConnectionErrorMessage>
                  We were unable to connect to your database. Please try again.
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
              <button onClick={() => setCurrentView('homePage')}>
                FUCKIN WORK
              </button>
              {!loading && <><LoginBtn onClick={sendLoginURI}><span>Login</span></LoginBtn></>}
              {loading && <LoginBtn disabled>Loading...</LoginBtn>}
            </LoginContainer>
          </Panel>
        </LeftPanel>
      </LoginPageWrapper>
    </React.Fragment >
  );
};

export default Login;



