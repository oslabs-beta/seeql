/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';
import AppDb from './appDb';
const chalk = require('chalk');
const { log } = console;
const P = (...args: any[]) => log(chalk.blue(...args));

// let mainWindow: Electron.BrowserWindow = null;
// let dbProcess: Electron.BrowserWindow = null;
let mainWindow;
let dbProcess;

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  require('electron-debug')();
}

// instantiates a new appDb
// $HOME/Library/Application\ Support/electron/seeql-user-data.json
// if nothing's there, use these defaults
const defaults = {
  configName: 'user-data',
  width: 700,
  height: 850,
  savedConnections: [],
  theme: 'default'
};
const appDb = new AppDb(defaults);

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

app.on('ready', async () => {
  P(`

     ('-').->  ('-')               <-.('-')            
     ( OO)_    ( OO).->             __( OO)     <-.    
    (_)--\_)  (,------.  ,------.  '-'---\_)  ,--. )   
    /    _ /   |  .---'  |  .---' |  .-.  |   |  ('-') 
    \_..'--.  (|  '--.   |  '--.  |  | |  |   |  |OO ) 
    .-._)   \  |  .--'   |  .--'  |  | |  |  (|  '__ | 
    \       /  |  '---.  |  '---. '  '-'  '-. |     |' 
     '-----'   '------'  '------'  '-----'--' '-----'  
    
                  Have a question? 
        Contact us on github.com/oslabs-beta/seeql
        
 `);
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  // #TODO: fetch from db x event listener
  // let { width, height } = appDb.get('windowBounds');
  mainWindow = new BrowserWindow({
    width: 700,
    height: 800,
    title: 'SeeQL',
    titleBarStyle: 'hiddenInset',
    backgroundColor: 'blue'
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // BrowserWindow = extends EventEmitter class
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds(); // getBounds returns an object with the height, width, x and y
    appDb.set('windowBounds', { width, height });
  });

  mainWindow.webContents.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      // #TODO: decide do we show the app window immediately with a spinner? or wait?
      const connStrs = appDb.get('savedConnections'); // this is a sync|blocking process, but doesn't have to be
      mainWindow.webContents.send('saved-connection-strings', connStrs);

      mainWindow.show();
      mainWindow.focus();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  dbProcess = new BrowserWindow({ show: false });
  dbProcess.loadURL(`file://${__dirname}/dbProcess.html`);

  ipcMain.on('remember-connection', (_event: any, connStr: string) => {
    appDb.set('connStr', connStr);
  });

  ipcMain.on('query-to-main', (_event: void, query: string) => {
    dbProcess.webContents.send('query-to-db', query);
    appDb.set('userQueryHistory', query); // make these push to an array
  });

  ipcMain.on('uri-to-main', (_event, uri) => {
    dbProcess.webContents.send('uri-to-db', uri);
  });

  ipcMain.on('query-to-main', (_event, query) => {
    dbProcess.webContents.send('query-to-db', query);
  });

  // Listening from homepage, to send to CLIENT's DATABASE
  ipcMain.on('uri-to-main', (_event, uri) => {
    dbProcess.webContents.send('uri-to-db', uri);
  });

  // Listening from database, to send to HOMEPAGE
  ipcMain.on(
    'database-tables-to-main',
    (_event: Event, databaseTables: any) => {
      mainWindow.webContents.send('tabledata-to-login', databaseTables);
    }
  );

  ipcMain.on('query-to-main', (_event, query) => {
    dbProcess.webContents.send('query-to-db', query);
  });

  ipcMain.on('logout-to-main', (_event, message) => {
    dbProcess.webContents.send('logout-to-db', message);
  });

  ipcMain.on('login-mounted', () => {
    dbProcess.webContents.send('login-mounted');
  });

  ipcMain.on('db-connection-error', (event, err) => {
    mainWindow.webContents.send('db-connection-error', err);
  });

  ipcMain.on('query-result-to-main', (_event, messagePayload) => {
    mainWindow.webContents.send('query-result-to-homepage', messagePayload);
  });

  ipcMain.on('inactivity-logout', (_event, message) => {
    mainWindow.webContents.send('inactivity-logout');
  });

  ipcMain.on('logout-reason', (_event, message) => {
    mainWindow.webContents.send('logout-reason', message);
  });

  ipcMain.on('user-theme-selected', (_event: Event, theme: string) => {
    appDb.set('theme', theme);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

export default class AppUpdater {
  public constructor() {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
