import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import AppDb from './appDb';
import path from 'path';

// import { autoUpdater } from 'electron-updater';
// export default class AppUpdater {
//   public constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let mainWindow = null;
let dbProcess = null;

const defaults = {
  configName: 'user-data',
  width: 800, // will be the default window size if they haven't resized ever
  height: 600,
  savedConnections: [],
  theme: 'default'
};
const appDb = new AppDb(defaults);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  // process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
  // require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

app.setAboutPanelOptions({
  applicationName: 'SeeQL',
  applicationVersion: '1.0.0-beta',
  version: '1.0.0-beta'
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: true,
    width: appDb.get('width') || defaults.width,
    height: appDb.get('height') || defaults.height,
    minWidth: 500,
    minHeight: 300,
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, 'internals/img/icon.png')
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      // const connStrs = appDb.get('savedConnections');
      // mainWindow.webContents.send('saved-connections', connStrs);

      // const userTheme = appDb.get('userThemePreference');
      // mainWindow.webContents.send('user-theme-preference', userTheme);

      mainWindow.show();
      mainWindow.focus();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  dbProcess = new BrowserWindow({ show: false });
  dbProcess.loadURL(`file://${__dirname}/dbProcess.html`);

  // sent * from * the renderer process when the user selects "remember me"
  // savedConnStr = { name: "name for connStr", uri: 'postgres://etc' }
  ipcMain.on('remember-connection', (_event: Event, savedConnStr: any) => {
    appDb.set('connStr', savedConnStr);
  });

  // saves queries to display in side-panel @ some point
  ipcMain.on('query-to-main', (_event: void, query: string) => {
    dbProcess.webContents.send('query-to-db', query);
    appDb.set('userQueryHistory', query);
  });

  // saves users theme if they select one which isn't default
  ipcMain.on('user-theme-selected', (_event: Event, theme: string) => {
    appDb.set('theme', theme);
  });

  // Listening from homepage, to send to database
  ipcMain.on('uri-to-main', (_event: void, uri: string) => {
    dbProcess.webContents.send('uri-to-db', uri);
  });

  ipcMain.on('query-to-main', (_event: void, query: string) => {
    dbProcess.webContents.send('query-to-db', query);
  });

  ipcMain.on('logout-to-main', (_event: void, message: string) => {
    dbProcess.webContents.send('logout-to-db', message);
  });

  ipcMain.on('login-mounted', () => {
    dbProcess.webContents.send('login-mounted');
  });

  // Listening from database, to send to homepage
  ipcMain.on(
    'database-tables-to-main',
    (_event: void, databaseTables: any[]) => {
      mainWindow.webContents.send('tabledata-to-login', databaseTables);
      // we could save/cache this data but for now let's not
    }
  );

  ipcMain.on('db-connection-error', (_event: void, err: Error) => {
    mainWindow.webContents.send('db-connection-error', err);
    appDb.set('connectionError', err); // could be used in our crash reporting tools
  });

  ipcMain.on('query-result-to-main', (_event: void, messagePayload: any) => {
    mainWindow.webContents.send('query-result-to-homepage', messagePayload);
  });

  ipcMain.on('inactivity-logout', (_event: void, _message: string) => {
    mainWindow.webContents.send('inactivity-logout');
  });

  ipcMain.on('logout-reason', (_event: void, message: string) => {
    mainWindow.webContents.send('logout-reason', message);
    appDb.set('logoutReason', message);
  });

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    appDb.set('windowBounds', { width, height }); // getBounds returns an object with the height, width, x and y
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  console.log(`\n\n
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
  \n\n
  `);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
