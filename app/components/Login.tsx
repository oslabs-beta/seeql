import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {Redirect} from 'react-router-dom';
import {Client} from 'pg';

// const ToggleSSL = styled.button`
//   padding: 5px 20px;
//   margin: 10px;
//   font-family: 'Poppins', sans-serif;
//   display: flex;
// `

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
  border: ${ (props) =>
    props.requiredErr
      ? '1px solid #ca333e'
      : '1px solid lightgrey'};
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

const Login = () => {
  const [URI, setURI] = useState('');
  const [requiredError, setRequiredError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const sendLoginURI = (): void => {
    // #TODO: toggleSSL = add ?ssl=true
    // let useSSL: boolean = false;
    // const toggleSSL = (): boolean => useSSL = true;
    const client = new Client(URI + '?ssl=true')

    client.connect((err: string, res: string) => {
      if (err) {
        console.log(err, 'err conecting')
      } else {
        console.log('we connected')
      }
    })

    const getTables = () => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT table_name
                      FROM information_schema.tables
                      WHERE table_schema='public'
                      AND table_type='BASE TABLE'`,
          (err: string, result: string) => {
            if (err) reject(err);
            resolve(result)
          });
      })
    }

    const getForeignKeys = (tableName: string) => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT tc.table_schema,
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
          (err: string, result: string) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    const getColumns = (tableName: string) => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT COLUMN_NAME AS ColumnName,
                             DATA_TYPE AS DataType,
                             CHARACTER_MAXIMUM_LENGTH AS CharacterLength,
                             COLUMN_DEFAULT AS DefaultValue
                      FROM INFORMATION_SCHEMA.COLUMNS
                      WHERE TABLE_NAME = '${tableName}'`,
          (err: string, result: string) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    const getPrimaryKey = (tableName: string) => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT column_name
                      FROM pg_constraint, information_schema.constraint_column_usage
                      WHERE contype = 'p'
                      AND information_schema.constraint_column_usage.table_name = '${tableName}'
                      AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`,
          (err: string, result: string) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    async function composeTableData() {
      let tablesArr = []
      var tableNames: any = null
      tableNames = await getTables()

      for (let table of tableNames.rows) {
        table.primaryKey = await getPrimaryKey(table.table_name)
        table.foreignKey = await getForeignKeys(table.table_name)
        table.columns = await getColumns(table.table_name)

        tablesArr.push(table)
      }

      return new Promise((resolve, reject) => {
        resolve(tablesArr)
      })
    }
    composeTableData().then(r => console.log('table data #TODO: render when component is decided', r))

    if (!URI) setRequiredError(true);
    else {
      setLoading(true);

      // #TODO: handle errors
      if (true) {
        setRedirectToHome(true);
        setConnectionError(false);
      }
      else {
        setConnectionError(true);
        setLoading(false);
      };
    };
  };

  const captureURI = (e): void => {
    const sanitizedURI = e.target.value.replace(/\s+/g, "");
    setURI(sanitizedURI);
    if (requiredError) setRequiredError(false);
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
      {/* { #TDOD
      <ToggleSSL onClick={toggleSSL}>
        use SSL?
      </ToggleSSL>
        } */}

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
