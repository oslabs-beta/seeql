import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import Db from '../db'

interface URIInputProps {
  readonly requiredErr: boolean;
};

const URIInput = styled.textarea<URIInputProps>`
  width: 200px;
  height: 100px;
  border-radius: 3px;
  border: ${(props) => {
    return props.requiredErr ? '1px solid #ca333e' : '1px solid lightgrey';
  };
  overflow: wrap;
  resize: none;
  transition: 0.3s;
  padding: 5px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
  :focus {
    outline: none;
  }
`

const LoginContainer = styled.div`
  background-color: #e8ecf1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  height: 100vh;
`
const LoginBtn = styled.button`
  padding: 5px 20px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  display: flex;
`

const InputLabel = styled.span`
  color: black;
  font-family: 'Poppins', sans-serif;
`

const ConnectionErrorMessage = styled.div`
  background-color: #f1c7ca;
  color: #ca333e;
  border-radius: 3px;
  padding: 10px;
  margin: 5px;
  font-size: 80%;
  font-family: 'Poppins', sans-serif;
  transition: 0.5s;
`

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 60%;
`

const Login = () => {
  const [URI, setURI] = useState('');
  const [requiredError, setRequiredError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const db = new Db()

  const sendLoginURI = (): void => {
    if (!URI) setRequiredError(true);
    else {
      setLoading(true);

      // #TODO:
      if (true) {
        setRedirectToHome(true);
        setConnectionError(false);
      } else {
        setConnectionError(true);
        setLoading(false);
      }
    }
  };

  const captureURI = (e): void => {
    if (requiredError) setRequiredError(false);

    const sanitizedURI = e.target.value.replace(/\s+/g, "");
    setURI(sanitizedURI);

    db.conn(sanitizedURI)
  };

  const redirectHome = () => {
    if (redirectToHome) return <Redirect to="/homepage" />;
  };

  return (
    <LoginContainer>

      {
        connectionError
        && <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage>
      }

      <InputLabel>URI Connection String</InputLabel>

      <URIInput
        requiredErr={requiredError}
        onChange={captureURI}
        placeholder="Enter your URI connection string..."
      >
      </URIInput>

      {requiredError
        && <RequiredWarning>This field is required</RequiredWarning>
      }

      {!isLoading
        && <LoginBtn onClick={sendLoginURI}>Login</LoginBtn>
      }

      {isLoading
        && <LoginBtn
          disabled
        >Loading...
        </LoginBtn>
      }

      {redirectHome()}
    </LoginContainer>
  );
}

export default Login;
