/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';
import AppDb from './appDb';
import uuid from 'uuid/v4';
import log from 'electron-log';

let mainWindow = null;
let dbProcess = null;

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  // just for development obvs (hehe) gets rid of console errors covering more relevant errors
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  log.verbose(`\napp started in ${process.env.NODE_ENV} mode\n`);
  require('electron-debug')();
}

// instantiate a new appDb
// data is saved to: Users/$(WHOAMI)/Library/Application Support/electron/user-data.json
// on each write it's overwritten (for now)
// see: "user-data-sample.json" for an example of output
const appDb = new AppDb({
  configName: 'user-data', // file name for user-data (not just preferences since for now we're also logging db query information there
  defaults: {
    windowBounds: {
      width: 1024,
      height: 728
    }
  }
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  // if no height/width, use "defaults"
  let { width, height } = appDb.get('windowBounds');
  mainWindow = new BrowserWindow({
    width,
    height,
    vibrancy: 'appearance-based',
    title: 'SeeQL',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FAF' // make app feel more native by settings a background color
  });

  // BrowserWindow = extends EventEmitter class
  mainWindow.on('resize', () => {
    // listen for resize event emitted on window resize
    let { width, height } = mainWindow.getBounds(); // getBounds returns an object with the height, width, x and y
    appDb.set('windowBounds', { width, height });
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is not defined');

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    // const preferences = appDb.get('userPreferences');
    // send all user preferences, savedSettings, etc. before window loads, but after window launches
    // (#TODO: display a spinner in the meantime where it's merely pink rn)
    // #TODO: merge latest theme branch so i can properly set this var
    // mainWindow.webContents.send('user-theme', preferences.theme);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  dbProcess = new BrowserWindow({ show: false });
  dbProcess.loadURL(`file://${__dirname}/dbProcess.html`);

  // Listening from database, to send to homepage

  // ipcMain.on('remember-connection', (savedConnectionString: string, err: Error) => {
  //     if (err) this.appDb.logErr(`logErr: `, err);
  //     log.verbose('user clicked remember connection for ', savedConnectionString)
  //     appDb.set({
  //       savedConnectionString: savedConnectionString,
  //       savedConnectionStringId: uuid()
  //     });
  //   }
  // );

  // save their theme settings (default = true)
  // ipcMain.on('custom-theme-selected', (userTheme: string, err: Error) => {
  //   appDb.set('user-theme', userTheme);
  // });

  ipcMain.on('query-to-main', (_event: void, query: string) => {
    log.verbose([`ipcMain.on('query-to-main') recieved :`, query]); // this logs in the browsers console and not the electron process!
    // logs:
    // 17:05:05.901 › [ 'ipcMain.on('query-to-main') recieved :', 'SELECT * FROM awesome_table' ]
    dbProcess.webContents.send('query-to-db', query);
    appDb.set('queryFromUserInMainProcess', query);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
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
  ipcMain.on('database-tables-to-main', (_event: Event, databaseTables: any) => {
    mainWindow.webContents.send('tabledata-to-login', databaseTables);
    appDb.set(`database-tables-to-main logged`, databaseTables);
  });

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
    // appDb.set(`db-connection-error logged: ${event} ${err}`);
  });

  ipcMain.on('query-result-to-main', (_event, messagePayload) => {
    mainWindow.webContents.send('query-result-to-homepage', messagePayload);
    // appDb.set(`query-result-to-main logged: ${event + messagePayload}`); // #TODO: decide if we want to save history query
  });

  ipcMain.on('inactivity-logout', (_event, message) => {
    mainWindow.webContents.send('inactivity-logout');
  });

  ipcMain.on('logout-reason', (_event, message) => {
    mainWindow.webContents.send('logout-reason', message);
  });
});
export default class AppUpdater {
  public constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
