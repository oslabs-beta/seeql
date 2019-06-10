import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { Redirect } from 'react-router-dom';
// import client from '../Database/dbConnect';
import dbQuery from '../Database/dbMiddleware';
// import HomePage from 'app/containers/HomePage';
// import DatabaseContext from '../Context/dataContext';
// import databaseContext from '../Context/dataContext';

// const ToggleSSL = styled.button`
//   padding: 5px 20px;
//   margin: 10px;
//   font-family: 'Poppins', sans-serif;
//   display: flex;
// `

//after the uri is input intp the textbox in this component, i need to use the captured uri to connect to the database, then get all the tbles.

//on the backend it would look like this: ('/', dbquery.connect, db.getallTables, (req, res)=>{res.send(res.locals)} )
//here i was to create a function that when invoked(), captures the uri THEN connects to the db--import the connection-- THEN redirects--THEN on the homepage, use the open connection to--get all tables.

const LoginContainer = styled.div`
  background-color: #e8ecf1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  height: 100vh;
`;
const URIInput = styled.textarea`
  width: 200px;
  height: 100px;
  border-radius: 3px;
  border: ${props =>
    props.requiredErr ? '1px solid #ca333e' : '1px solid lightgrey'};
  overflow: wrap;
  resize: none;
  transition: 0.3s;
  padding: 5px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;

  :focus {
    outline: none;
  }
`;
const LoginBtn = styled.button`
  padding: 5px 20px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  display: flex;
`;

const InputLabel = styled.span`
  color: black;
  font-family: 'Poppins', sans-serif;
`;

const ConnectionErrorMessage = styled.div`
  background-color: #f1c7ca;
  color: #ca333e;
  border-radius: 3px;
  padding: 10px;
  margin: 5px;
  font-size: 80%;
  font-family: 'Poppins', sans-serif;
  transition: 0.5s;
`;

const RequiredWarning = styled.span`
  color: #ca333e;
  font-size: 60%;
`;

const Login = () => {
  const [URI, setURI] = useState('');
  const [table, setTable] = useState([]);
  // const [renderArr, setRenderArr] = useState([]);
  const [requiredError, setRequiredError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // const [redirectToHome, setRedirectToHome] = useState(false);

  // const validateURI = URI => {
  //   if (!URI) setRequiredError(true);
  //   else {
  //     setLoading(true);
  //     // #TODO: handle errors
  //     if (true) {
  //       setRedirectToHome(true);
  //       setConnectionError(false);
  //     } else {
  //       setConnectionError(true);
  //       setLoading(false);
  //     }
  //   }
  // };

  const captureURI = (e): void => {
    const sanitizedURI = e.target.value.replace(/\s+/g, '');
    setURI(sanitizedURI);
    if (!sanitizedURI) setRequiredError(true);
    else {
      setLoading(true);
      // #TODO: handle errors
      if (true) {
        // setRedirectToHome(true);
        setConnectionError(false);
      } else {
        setConnectionError(true);
        setLoading(false);
      }
    }
    if (requiredError) setRequiredError(false);
  };

  // ...

  useEffect(() => {
    let arr = [];
    //create context
    const tables = new dbQuery();
    tables.composeTableData().then(function(tablePromise) {
      arr.push(tablePromise);
    });
    setTable(arr);
  }, [URI]);
  console.log(table);

  // const redirectHome = () => {
  //   if (redirectToHome)
  //     return <Redirect to={{ pathname: '/homepage', component: Homepage }} />;
  // };

  // function setTableState() {
  //   setRenderArr(table);
  // }

  // const connect = URI => {
  //   //once  the uri is updated, use context to make the uri available globally
  //   //or local storage?
  //   //if local storage, function to hash into local and the unhash from local
  //   dbConnect(URI);
  //   validateURI(URI);
  //   const tableData = dbQuery.getTables;
  //   console.log(tableData);
  //   //then compose table data using async function  and update the context
  //   dbQuery.composeTableData().then(
  //     tables =>
  //       console.log(
  //         'table data #TODO: render when component is decided',
  //         tables
  //       )
  //     //then redirect
  //   );
  //   //then
  // };

  return (
    <LoginContainer>
      {connectionError && (
        <ConnectionErrorMessage>
          Unable to connect to the database. Please try again.
        </ConnectionErrorMessage>
      )}

      <InputLabel>URI Connection String</InputLabel>

      <URIInput
        requiredErr={requiredError}
        onChange={captureURI}
        placeholder="Enter your URI connection string..."
      />

      {requiredError && (
        <RequiredWarning>This field is required</RequiredWarning>
      )}
      {/* { #TDOD
      <ToggleSSL onClick={toggleSSL}>
        use SSL?
      </ToggleSSL>
        } */}

      {!isLoading && <LoginBtn onClick={captureURI}>Login</LoginBtn>}
      {isLoading && <LoginBtn disabled>Loading...</LoginBtn>}

      {/* <HomePage /> */}
      {/* {redirectHome()} */}
    </LoginContainer>
  );
};

export default Login;
