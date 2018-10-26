// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain,
  globalShortcut, dialog, Tray, Menu } = require("electron");
const path = require("path");

if (process.env.NODE_ENV == undefined) process.env.NODE_ENV = "production";

console.info("Main start...", process.env.NODE_ENV);

class Main {
  constructor() {
  }

  static init() {
    this.needSingleIntance = this.isDev() ? false : true;
    if (!this._checkSingleIntance()) {
      console.log("单例限制, 只启动一个实例");
      return;
    }

    this.mainWindow = null;
    this.tray = null;

    this._initEvent();
  }

  // 生产模式启用单例
  static _checkSingleIntance() {
    if (!this.needSingleIntance) {
      return true;
    }
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      console.log("---gotTheLock: ", gotTheLock);
      app.quit();
      return false;
    }

    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (Main.mainWindow) {
        // if (mainWindow.isMinimized()) mainWindow.restore();
        Main.mainWindow.show();
        // mainWindow.focus();
      }
    });

    return true;
  }

  static _initEvent() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", () => {
      this.createWindow();
      this.createTray();

      if (this.isDev()) {
        this._initDebuger();
      } else {
        // this.mainWindow.webContents.openDevTools({ mode: "bottom" });
      }

      this._initTestIPC();
      this._registerGlobalShortcut();
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("will-quit", () => {
      globalShortcut.unregisterAll();
    });

    app.on("activate", () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.mainWindow === null) {
        this.createWindow();
      }
    });
  }

  static createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      autoHideMenuBar: true, // 自动隐藏菜单栏（按alt键显示）
      icon: "./src/icon/icon_48.ico",
    });

    // and load the index.html of the app.
    this.mainWindow.loadFile("index.html");
    // this.mainWindow.loadURL("http://localhost:1234/test.html");

    // Emitted when the window is closed.
    this.mainWindow.on("closed", () => {
      this.mainWindow.destroy();
      this.mainWindow = null;
      if (this.tray) {
        this.tray.destroy();
        this.tray = null;
      }
    });

    if (this.needSingleIntance) {
      // 最小化到托盘
      this.mainWindow.on("hide", () => {
        this.tray && this.tray.setHighlightMode("never");
      });
      // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
      // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
      this.mainWindow.on("close", (event) => {
        this.mainWindow.hide();
        this.mainWindow.setSkipTaskbar(true);
        event.preventDefault();
      });
    }
  }

  // 绑定快捷键等
  static _registerGlobalShortcut() {
    globalShortcut.register("ESC", () => {
      this.mainWindow.setFullScreen(false);
      this.mainWindow.focus(); // 和 show() 方法有何区别?
    });

    globalShortcut.register("CommandOrControl+Alt+K", () => {
      console.log("快捷键, 按下了CommandOrControl+Alt+K");
      dialog.showMessageBox({
        type: "info",
        message: "成功!",
        detail: "你按下了一个全局注册的快捷键绑定.",
        buttons: ["好的"]
      });
    });
  }

  static createTray() {
    // 开发模式不启动最小化托盘, 会重复开启
    if (this.isDev()) {
      return;
    }
    //创建系统通知区菜单
    this.tray = new Tray(path.join(__dirname, "./src/icon/icon_48.ico"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Exit", click: () => { //我们需要在这里有一个真正的退出（这里直接强制退出）
          this.mainWindow.destroy();
          app.quit();
        }
      },
    ]);

    this.tray.setToolTip("PomodoroJason");
    this.tray.setContextMenu(contextMenu);
    this.tray.on("click", () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
        this.mainWindow.setSkipTaskbar(false);
      } else {
        this.mainWindow.show();
        this.mainWindow.setSkipTaskbar(true);
      }
    });
  }

  static _initTestIPC() {
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
      Main.mainWindow.webContents.send("ping", 5);
    });
  }

  static isDev() {
    return process.env.NODE_ENV !== "production";
  }

  static _initDebuger() {
    // debug
    let watchFiles = ["./main.js", "./index.html", "./src/webIpc", "./dist"];
    require("electron-reload")(watchFiles, {
      electron: require(`${__dirname}/node_modules/electron`)
    });

    if (this.mainWindow) {
      this.mainWindow.webContents.openDevTools({ mode: "right" });
    }
  }

}

Main.init();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// 下面抛出的方法可以在渲染进程中直接调用
exports.pong = arg => {
  //Print 6
  console.log("main3: ", arg);
};

// 设置全屏
exports.setFullScreen = (isFull) => {
  Main.mainWindow.setFullScreen(isFull ? true : false);
};

// 显示主界面
exports.showMainWindow = () => {
  console.debug("mainWindow.show");
  Main.mainWindow.show();
};