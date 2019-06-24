import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { grommet } from "grommet/themes"
import { Grommet } from 'grommet';
import LoginComponent from './LoginComponent'
import TitleComponent from './TitleComponent'

const InvisibleHeader = styled.div`
  height: 30px;
  -webkit-app-region: drag;
`;

const funtimes = keyframes`
 0%{background-position:0% 50%}
 50%{background-position:100% 50%}
 100%{background-position:0% 50%}
`;

const LoginPageWrapper = styled.div`
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  width: 100vw;
  background-color: white;
  color: white;
  animation: ${funtimes} 9s ease infinite;
  background: linear-gradient(170deg, #49cefe, #c647bc);
  background-size: 500% 100%;
`;

const Login = () => {
  return (
    <Grommet theme={grommet}>
      <InvisibleHeader></InvisibleHeader>
      <LoginPageWrapper>
        <TitleComponent />
        <LoginComponent />
      </LoginPageWrapper>
    </Grommet>
  );
};

export default Login;
