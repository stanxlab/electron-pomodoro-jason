// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");

console.info("Main start...");

// debug
require("electron-debug")({ showDevTools: true });
let watchFiles = ["./main.js", "./index.html", "./src"];
require("electron-reload")(watchFiles, {
  electron: require(`${__dirname}/node_modules/electron`)
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // mainWindow.loadURL('http://localhost:8090');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  __initEvent();
}

function __initEvent() {
  globalShortcut.register("ESC", () => {
    mainWindow.setFullScreen(false);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 页面与主进程交互

// Listen for async message from renderer process
ipcMain.on("async", (event, arg) => {
  // Print 1
  console.log("main1: ", arg);
  // Reply on async message from renderer process
  event.sender.send("async-reply", 2);
});

// Listen for sync message from renderer process
ipcMain.on("sync", (event, arg) => {
  // Print 3
  console.log("main2: ", arg);
  // Send value synchronously back to renderer process
  event.returnValue = 4;
  // Send async message to renderer process
  mainWindow.webContents.send("ping", 5);
});

// Make method externaly visible
exports.pong = arg => {
  //Print 6
  console.log("main3: ", arg);
};

// 设置全屏
exports.setFullScreen = (isFull) => {
  mainWindow.setFullScreen(isFull ? true : false);
};

exports.showMainWindow = () => {
  console.debug("mainWindow.show");
  mainWindow.show();
};