/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import AppDb from './appDb';
import sourceMapSupport from 'source-map-support';
import unhandled from 'electron-unhandled';
import { openNewGitHubIssue, debugInfo } from 'electron-util';

// this will give actual error messages rather than "unhandled promise rejections"
// the config object allows the user to auto-open a github issue
unhandled({
  reportButton: error => {
    openNewGitHubIssue({
      user: 'oslabs-beta',
      repo: 'seeql',
      body: `\n${error.stack}\`\n---\n${debugInfo()}`
    });
  }
});

unhandled();

let mainWindow = null;
let queryWindow = null;

// instantiate a new appDb
// data is saved to: Users/tyler/Library/Application Support/electron/user-data.json
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
    show: false,
    width,
    height,
    titleBarStyle: 'hiddenInset'
  });

  // BrowserWindow = extends EventEmitter class
  // listen for resize event emitted on window resize
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds(); // getBounds returns an object with the height, width, x and y
    appDb.set('windowBounds', { width, height });
    log.info('appDbs window bounds on get are', appDb.get('windowBounds'));
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  queryWindow = new BrowserWindow({ show: false });
  queryWindow.loadURL(`file://${__dirname}/query.html`);

  // Listening from homepage, to send to database
  ipcMain.on('uri-to-main', (event, uri) => {
    appDb.set('uri-to-main logged', uri);
    log.verbose(appDb.get('uri-to-main'));
    queryWindow.webContents.send('uri-to-db', uri);
  });

  ipcMain.on('query-to-main', (event, query) => {
    queryWindow.webContents.send('query-to-db', query);
    appDb.set('queryFromUserInMainProcess', query);

    // this logs in the browsers console and not the electron process!
    log.info(
      'appDb.get results for queryFromUserInMainProcess',
      appDb.get('queryFromUserInMainProcess')
    );
  });

  // Listening from database, to send to homepage
  ipcMain.on('database-tables-to-main', (event: Event, databaseTables: any) => {
    appDb.set(`database-tables-to-main logged: ${event} ${databaseTables}`);
    mainWindow.webContents.send('tabledata-to-login', databaseTables);
  });

  ipcMain.on('db-connection-error', (event: Event, err: Error) => {
    appDb.set(`db-connection-error logged: ${event} ${err}`);
    mainWindow.webContents.send('db-connection-error', err);
  });

  ipcMain.on('query-result-to-main', (event: Event, messagePayload: any) => {
    appDb.set(`query-result-to-main logged: ${event} ${messagePayload}`);
    mainWindow.webContents.send('query-result-to-homepage', messagePayload);
  });
});

export default class AppUpdater {
  public constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
