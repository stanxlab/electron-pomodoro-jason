// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut, dialog, Tray, Menu } = require("electron");
const path = require("path");


if (process.env.NODE_ENV == undefined) process.env.NODE_ENV = "production";

console.info("Main start...", process.env.NODE_ENV);

const isDev = () => {
  return process.env.NODE_ENV !== "production";
};

if (isDev()) {
  // debug
  // require("electron-debug")({ showDevTools: true });
  let watchFiles = ["./main.js", "./index.html", "./src/webIpc", "./dist"];
  require("electron-reload")(watchFiles, {
    electron: require(`${__dirname}/node_modules/electron`)
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // 自动隐藏菜单栏（按alt键显示）
    icon: "./src/icon/icon_48.ico",
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // mainWindow.loadURL('http://localhost:8090');

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow.destroy();
    mainWindow = null;
    tray.destroy();
    tray = null;
  });


  // My托盘测试
  mainWindow.on("hide", () => {
    tray.setHighlightMode("never");
  });
  // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
  // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
  mainWindow.on("close", (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  //创建系统通知区菜单
  tray = new Tray(path.join(__dirname, "./src/icon/icon_48.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Exit", click: () => {
        mainWindow.destroy();
        app.quit();
      }
    },//我们需要在这里有一个真正的退出（这里直接强制退出）
  ]);
  tray.setToolTip("PomodoroJason");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  });


  if (isDev()) {
    mainWindow.webContents.openDevTools({ mode: "right" });
  } else {
    mainWindow.webContents.openDevTools({ mode: "bottom" });
  }

  __initEvent();
}


// 绑定快捷键等
function __initEvent() {
  globalShortcut.register("ESC", () => {
    mainWindow.setFullScreen(false);
    mainWindow.show();
  });

  globalShortcut.register("CommandOrControl+Alt+K", function () {
    console.log("快捷键, 按下了CommandOrControl+Alt+K");
    dialog.showMessageBox({
      type: "info",
      message: "成功!",
      detail: "你按下了一个全局注册的快捷键绑定.",
      buttons: ["好的"]
    });
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

app.on("will-quit", function () {
  globalShortcut.unregisterAll();
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