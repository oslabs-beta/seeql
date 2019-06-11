import * as React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {Redirect} from 'react-router-dom';
import {Client} from 'pg';
import composeTableData from "../db";


const ToggleSSL = styled.div`
  display: flex;
  padding: 5px 20px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  color: black;
  align-items: center;
  font-size: 80%;
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
const URIInput = styled.textarea`
  width: 200px;
  height: 100px;
  border-radius: 3px;
  border: ${ (props) =>
		props.requiredErr
			? '1px solid #ca333e'
			: '1px solid lightgrey'
	}
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

    const [tableData, setTableData] = useState([]);
	const [URI, setURI] = useState('');
	const [isSSL, setSSL] = useState(false);
	const [requiredError, setRequiredError] = useState(false);
	const [connectionError, setConnectionError] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	const sendLoginURI = (): void => {
		let updatedURI = URI;
		if (isSSL) updatedURI += '?ssl=true';
		if (!URI) setRequiredError(true);
		else {
			setLoading(true);
			const client = new Client(updatedURI)
			client.connect((err: string, res: string) => {
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
		if (redirectToHome) return <Redirect to={{ pathname: "/homepage", state: { tables: tableData } } } />;
	};

	return (
		<LoginContainer>
			{ connectionError
				&& <ConnectionErrorMessage>Unable to connect to the database. Please try again.</ConnectionErrorMessage>
			}

			<InputLabel>
				URI Connection String
				postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq
			</InputLabel>

			<URIInput
				requiredErr={requiredError}
				onChange={captureURI}
				placeholder="Enter your URI connection string..."
			>
			</URIInput>

			{requiredError
				&& <RequiredWarning>This field is required</RequiredWarning>
			}

			<ToggleSSL>
				<input type="checkbox" onChange={(e) => setSSL(e.target.checked)} />
				<label>ssl?</label>
			</ToggleSSL>

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
};

export default Login;
