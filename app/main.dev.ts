// main electron process (see IPC)
// `yarn build` or `yarn build-main`
import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: Electron.BrowserWindow;

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

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

// Respect the OSX convention of having the application in memory even
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
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
    // #TODO: investigate BrowserWindow Config option
    // https://github.com/electron/electron/blob/master/docs/tutorial/security.md#isolation-for-untrusted-content
    // nodeIntegration: false,
    title: "SeeQL: Database Visualized",
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event; https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
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

  // mainWindow.on("crashed", () => {
  //   console.log("crashed");
  // });
  // const win = new BrowserWindow({ width: 200, height: 200 });
  // mainWindow.webContents.on("before-input-event", event => {
  //   const choice = dialog.showMessageBox(win, {
  //     type: "question",
  //     buttons: ["Leave", "Stay"],
  //     title: "Do you want to leave this site?",
  //     message: "Changes you made may not be saved.",
  //     defaultId: 0,
  //     cancelId: 1
  //   });
  //   const leave = choice === 0;
  //   if (leave) {
  //     event.preventDefault();
  //   }
  // });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

