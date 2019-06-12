import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { Client } from "pg";
import composeTableData from "../db";

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
  font-family: "Poppins", sans-serif;
  letter-spacing: 2px;
  resize: none;
  padding: 10px;
  border: ${props =>
    props.requiredErr ? "1px solid #ca333e" : "1px solid lightgrey"};

  :focus {
    outline: none;
  }
`;

const ToggleSSL = styled.div`
  display: flex;
  padding: 5px 20px;
  margin: 10px;
  font-family: "Poppins", sans-serif;
  display: flex;
  color: black;
  align-items: center;
  font-size: 80%;
`;

const LoginContainer = styled.div`
  background-color: #e8ecf1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  height: 100vh;
`;

const LoginBtn = styled.button`
  padding: 5px 20px;
  margin: 10px;
  font-family: "Poppins", sans-serif;
  display: flex;
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
  background-color: ${props => props.selectedLoginType === props.buttonType ? 'white' : 'grey'};
`;

const URIContainer = styled.div`
background-color: #e8ecf1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`

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
  font-family: "Poppins", sans-serif;
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

const Login = () => {
  const [loginType, setLoginType] = useState('URI');
  const [host, setHost] = useState({ value: '', requiredError: false});
  const [port, setPort] = useState('5432');
  const [username, setUsername] = useState({ value: '', requiredError: false});
  const [password, setPassword] = useState({ value: '', requiredError: false});
  const [database, setDatabase] = useState({ value: '', requiredError: false});
	const [URI, setURI] = useState('');
  const [isSSL, setSSL] = useState(false);
  
	const [requiredError, setRequiredError] = useState(false);
	const [connectionError, setConnectionError] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);
  const [tableData, setTableData] = useState([]);

	const sendLoginURI = (): void => {
    if (connectionError) setConnectionError(false);
    let updatedPort = !port ? '5432' : port;
    let updatedURI;
    if (loginType === 'URI') updatedURI = URI;
    else if (loginType === 'Credentials') updatedURI = `postgres://${username.value}:${password.value}@${host.value}:${updatedPort}/${database.value}`

    if (isSSL) updatedURI += '?ssl=true';

    if (!updatedURI) setRequiredError(true);
    if (!host.value) setHost({ value: '', requiredError: true});
    if (!username.value) setUsername({ value: '', requiredError: true});
    if (!password.value) setPassword({ value: '', requiredError: true});
    if (!database.value) setDatabase({ value: '', requiredError: true});
    
    if (URI || (host.value && username.value && password.value && database.value )) {
			setLoading(true);
			const client = new Client(updatedURI);
			client.connect((err: Error) => {
				if (err) {
					setConnectionError(true);
					setLoading(false);
				} else {
          composeTableData(client)
            .then(tables => {
			        setConnectionError(false);
			        setTableData(tables);
			        setLoading(false);
              setRedirectToHome(true);
            })
            .catch((err: any) => console.log('composeTableData error:', err))
				}
			})
		}
	};

  const captureURI = (e): void => {
    const sanitizedURI = e.target.value.replace(/\s+/g, "");
    setURI(sanitizedURI);
    if (requiredError) setRequiredError(false);
  };

  const redirectHome = () => {
    if (redirectToHome)
      return (
        <Redirect
          to={{ pathname: "/homepage", state: { tables: tableData } }}
        />
      );
  };

  return (
    <LoginContainer>
      
      { connectionError
				&& <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage>
      }
      
      <InputLabel>
				<em>
        CS_DEMO_DB
				</em>
        <br />
        <br />
postgres://godugvmyduvduy:3b89454dd6a4090ac4a5574a00a2e13393dda232f258b3a6033c4ac4d24858ff@ec2-50-19-127-115.compute-1.amazonaws.com:5432/d16hrptvvsaq3f
        <br />
        <br />
				<em>
        MAGNOLIA:
				</em>
        <br />
        <br />
        postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq
      </InputLabel>
      
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

      { loginType === 'Credentials' && 
        <CredentialsContainer>
          <CredentialsInput type="text" 
            requiredErr={host.requiredError} 
            placeholder="host" 
            onChange={(e) => setHost({ value: e.target.value, requiredError: false }) } 
          />
          <CredentialsInput type="text" 
            requiredErr={false} 
            placeholder="port (default 5432)" 
            onChange={(e) => setPort(e.target.value) } 
          />
          <CredentialsInput type="text" 
            requiredErr={username.requiredError} 
            placeholder="username" 
            onChange={(e) => setUsername({ value: e.target.value, requiredError: false }) } 
          />
          <CredentialsInput type="text" 
            requiredErr={password.requiredError} 
            placeholder="password" 
            onChange={(e) => setPassword({ value: e.target.value, requiredError: false }) } 
          />
          <CredentialsInput type="text" 
            requiredErr={database.requiredError} 
            placeholder="database" 
            onChange={(e) => setDatabase({ value: e.target.value, requiredError: false }) } 
          />
          {(host.requiredError || username.requiredError || password.requiredError || database.requiredError)
            && <RequiredWarning>This field is required</RequiredWarning>
          }
        </CredentialsContainer>
      }

      { loginType === 'URI' && 
        <URIContainer>
          <URIInput
            requiredErr={requiredError}
            onChange={captureURI}
            placeholder="Enter your URI connection string..."
          />
          { requiredError &&
            <RequiredWarning>This field is required</RequiredWarning>}
        </URIContainer>
      }

			<ToggleSSL>
				<input type="checkbox" onChange={(e) => setSSL(e.target.checked)} />
				<label>ssl?</label>
			</ToggleSSL>

			{!isLoading && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>}
			{isLoading && <LoginBtn disabled>Loading...</LoginBtn>}

			{redirectHome()}
		</LoginContainer>
  );
};

export default Login;
