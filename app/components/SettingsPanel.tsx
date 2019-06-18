import * as React from 'react';
import { useReducer, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Context from '../contexts/themeContext';
import themeReducer from '../reducers/themeReducer';
import { shell } from 'electron';
import path from 'path'
const BrowserWindow = require('electron').remote.BrowserWindow
const dialog = require('electron').remote.dialog

const ProcessCrashBtn = styled.button`
  width: 200px;
  background-color: green;
`

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  width: 300px;
  height: 100vh;
  padding: 40px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.fontColor};
`;

const TopSection = styled.section`
  display: flex;
  flex-direction: column;
`;
const BottomSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  color: ${props => props.theme.fontColor};
  font-size: 30px;
`;
const Label = styled.label`
  color: ${props => props.theme.fontColor};
  padding: 10px 0;
`;
const GithubLink = styled.button`
  width: 200px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.fontColor};
`

const crashProcess = () => {
  const crashWinPath = path.join('file://', __dirname, '../app/crash-dialog.html')
  let win = new BrowserWindow({ width: 400, height: 320 })

  win.webContents.on('crashed', () => {
    const options = {
      type: 'info',
      title: 'Renderer Process Crashed',
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, index => {
      if (index === 0) win.reload()
      else win.close()
    })
  })

  win.on('close', function () { win = null })
  win.loadURL(crashWinPath)
  win.show()
}


const SettingsPanel = () => {
  const [context, setContext] = useContext(Context);
  const [state, dispatch] = useReducer(themeReducer, context);
  const [toggle, setToggle] = useState(false);
  const contextText = context.light.toString();

  return (
    <PanelWrapper>
      <TopSection>
        <Title>Settings</Title>
        <DivWrapper>
          <Label>Theme</Label>
          <button
            onClick={() => {
              setToggle(!toggle);
              setContext(state);
              toggle
                ? dispatch({ type: 'TOGGLE_DARK' })
                : dispatch({ type: 'TOGGLE_LIGHT' });
            }}
          >
            {contextText}
          </button>
        </DivWrapper>
        <DivWrapper>
          <Label>Font Size</Label>
          <select>
            <option value="">Normal</option>
            <option value="">small</option>
            <option value="">large</option>
            <option value="">Extra-Large</option>
          </select>
        </DivWrapper>
      </TopSection>
      <BottomSection>
        <div style={state}>CHANGE ME HEY BLAHHSLAH</div>
        <NavLink to="/" activeStyle={{ color: 'black ' }}> Sign Out
        </NavLink>
      <GithubLink 
        onClick={() => 
          shell.openExternal(`https://https://github.com/oslabs-beta/seeql`)
        }> 
        SeeQL is Open Source
      </GithubLink>
      <ProcessCrashBtn onClick={crashProcess}>crash process</ProcessCrashBtn>
      </BottomSection>
    </PanelWrapper>
  );
};

export default SettingsPanel;
