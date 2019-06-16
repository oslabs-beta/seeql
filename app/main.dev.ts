/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off */
import electron, { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";

export default class AppUpdater {
  public constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: Electron.BrowserWindow = null;
let queryWindow: Electron.BrowserWindow = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
}

const installExtensions = async (): Promise<any> => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

// Quit when all windows are closed, unless OS X,
// which stays in memory until CMD+Q
app.on("window-all-closed", (): void => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// get webContents from remote process
app.on("remote-get-current-web-contents", (event, webContents): void => {
  console.log(event);
  console.log(`\n \n ${webContents}`);
  event.preventDefault();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
  }
});

app.on("ready", async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    title: "SeeQL: Database Visualized",
    show: false,
    width: 1024,
    height: 728,
    titleBarStyle: "hiddenInset"
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  // detects user's display preferences and notifies FE to setup theme
  const prefs = electron.systemPreferences || electron.remote.systemPreferences;
  const isDarkMode = () => prefs.isDarkMode();

  mainWindow.webContents.on("did-finish-load", () => {
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("unresponsive", () => {
    console.log(`handle this somehow`);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  queryWindow = new BrowserWindow({ show: false });
  queryWindow.loadURL(`file://${__dirname}/query.html`);

  // Listening from homepage, to send to database
  ipcMain.on("uri-to-main", (_event: Event, uri: string) => {
    queryWindow.webContents.send("uri-to-db", uri);
  });

  ipcMain.on("query-to-main", (_event: Event, query: string) => {
    queryWindow.webContents.send("query-to-db", query);
  });

  // Listening from database, to send to homepage
  ipcMain.on("database-tables-to-main", (
    _event: Event,
    databaseTables /* #TODO */
  ) => {
    mainWindow.webContents.send("tabledata-to-login", databaseTables);
  });

  ipcMain.on("db-connection-error", (_event: Event, err: Error) => {
    mainWindow.webContents.send("db-connection-error", err);
  });

  ipcMain.on("query-result-to-main", (
    _event: Event,
    messagePayload /* #TODO */
  ) => {
    mainWindow.webContents.send("query-result-to-homepage", messagePayload);
  });

  // ipcMain.on("OSX-dark-theme-enabled", (_event: void, err: Error) => {
  //   mainWindow.webContents.send("OSX-dark-theme-enabled", err)
  // })

  // const onDarkModeChanged = notifyFrontend => {
  //   return prefs.subscribeNotification('AppleInterfaceThemeChangedNotification', notifyFrontend);
  // };
});
