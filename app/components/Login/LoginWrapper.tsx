import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import LoginShell from './LoginShell';

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
  color: white;
  animation: ${funtimes} 8s ease infinite;
  background: linear-gradient(270deg, #49cefe, #c647bc);
  background-size: 400% 400%;
`;

const RightPanel = styled(Panel)`
  background-color: white;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: none;
`;

const Login = () => {
  return (
    <React.Fragment>
      <InvisibleHeader></InvisibleHeader>
      <LoginPageWrapper>
        <LeftPanel>
          <Title>SeeQL</Title>
        </LeftPanel>
        <RightPanel>
          <LoginShell />
        </RightPanel>
      </LoginPageWrapper>
    </React.Fragment>
  );
};

export default Login;
