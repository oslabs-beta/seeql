/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;
let dbProcess = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    titleBarStyle: 'hiddenInset'
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
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

  dbProcess = new BrowserWindow({ show: false });
  dbProcess.loadURL(`file://${__dirname}/dbProcess.html`);

  // Listening from homepage, to send to database
  ipcMain.on('uri-to-main', (_event, uri) => {
    dbProcess.webContents.send('uri-to-db', uri);
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

  // Listening from database, to send to homepage
  ipcMain.on('database-tables-to-main', (_event, databaseTables) => {
    mainWindow.webContents.send('tabledata-to-login', databaseTables);
  });

  ipcMain.on('db-connection-error', (_event, err) => {
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
});
