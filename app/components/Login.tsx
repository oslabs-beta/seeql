import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
const ipcRenderer = require('electron').ipcRenderer;

const LoginContainer = styled.div`
  background-color: #e8ecf1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  height: 100vh;
`
const URIInput = styled.textarea`
  width: 200px;
  height: 100px;
  border-radius: 3px;
  border: ${props => props.requiredErr ? '1px solid #ca333e' : '1px solid lightgrey'};
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

//Functional component 
const Login = () => {

  const [ URI, setURI ] = useState('');
  const [ requiredError, setRequiredError ] = useState(false);
  const [ connectionError, setConnectionError ] = useState(false);
  const [ isLoadingState, setLoadingState ] = useState(false);
  const [ redirectToHome, setRedirectToHome ] = useState(false);

  //Trigger on click of "Login" to connect to database
  const connectToDatabase = ():void => {
    if(!URI) setRequiredError(true);
    else {
      setLoadingState(true);
      const connectionStatus = ipcRenderer.sendSync('connection-string', URI);
      if(connectionStatus == 'success') {
        setRedirectToHome(true);
        setConnectionError(false);
      }
      if(connectionStatus == 'failure') {
        setConnectionError(true);
        setLoadingState(false);
      }
    }
  }

  //Set the URI
  const captureURI = (e):void => {
    setURI(e.target.value)
    if(requiredError) setRequiredError(false);
  }

  //Redirect to Home on successful connection
  const redirectHome = () => {
    if(redirectToHome) return <Redirect to="/homepage" />
  }

  return (
    <LoginContainer>
      { connectionError && <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage> }
      <InputLabel>URI Connection String</InputLabel>
      <URIInput requiredErr={requiredError} onChange={ captureURI } placeholder="Enter your URI connection string.."></URIInput>
      { requiredError && <RequiredWarning>This field is required</RequiredWarning> }
      { !isLoadingState && <LoginBtn onClick={connectToDatabase}>Login</LoginBtn> }
      { isLoadingState && <LoginBtn onClick={connectToDatabase} disabled>Loading...</LoginBtn>}
      {redirectHome()}
    </LoginContainer>
  );
}

export default Login;
