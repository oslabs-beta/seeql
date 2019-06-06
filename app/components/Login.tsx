import * as React from 'react';
import { useState } from 'react';
// const routes = require('../constants/routes.json');
import styled from 'styled-components';

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
    border: 1px solid #4daf7c;
    transform: scale(1.01);
  }
`
const LoginBtn = styled.button`
  padding: 5px 10px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
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

  const [ URI, setURI ] = useState('');
  const [ requiredError, setRequiredError ] = useState(false);
  const [ connectionError, setConnectionError ] = useState(false);
  
  const connectToDatabase = () => {
    if(!URI) {
      console.log('URI String Field is Required')
      setRequiredError(true);
    }
    else console.log('send to database', URI)
    setConnectionError(true);
  }

  const captureURI = (e) => {
    setURI(e.target.value)
    if(requiredError) setRequiredError(false);
  }

  return (
    <LoginContainer>
      { connectionError && <ConnectionErrorMessage>There was an error connecting to the database. Please try again.</ConnectionErrorMessage> }
      <InputLabel>URI Connection String</InputLabel>
      <URIInput requiredErr={requiredError} onChange={ captureURI } placeholder="Enter your URI connection string.."/>
      { requiredError && <RequiredWarning>This field is required</RequiredWarning>}
      <LoginBtn onClick={connectToDatabase}>Login</LoginBtn>
    </LoginContainer>
  );
}

export default Login;
