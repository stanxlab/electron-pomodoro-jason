// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { ipcRenderer, remote } = require("electron");
const main = remote.require("./main");

class webIpc {
    static init() {
        this.mainCallbacks = {};
        // 监听主进程的命令
        ipcRenderer.on("sync-router", (event, arg) => {
            console.log("Renderer sync-router: ", arg);
            let { cmd, params = {} } = arg;
            if (typeof this.mainCallbacks[cmd] === "function") {
                this.mainCallbacks[cmd](params);
            } else {
                console.error(`主进程命令的回调函数未定义,${cmd}`);
            }
        });

        this._bingKeyDown();
    }

    // 绑定window键盘事件
    static _bingKeyDown() {
        window.onkeydown = (e) => {
            console.log("keyDown: ", String.fromCharCode(e.keyCode) + " --> " + e.keyCode);
            switch (e.keyCode) {
                case 27:  // ESC, 退出全屏
                    // 強制休息模式不能快捷退出全屏
                    if (!window.SYS_FORCE_RESET_MODE) {
                        this.cancelFullScreen();
                    }
                    break;
                case 13:  // Enter, 退出全屏
                    if (!window.SYS_FORCE_RESET_MODE) {
                        this.cancelFullScreen();
                    }
                    break;
                case 123:  // F12 调试面板
                    this.openDevTools();
                    break;
            }
        };
    }

    static setFullScreen() {
        main.setFullScreen(true);
    }
    static cancelFullScreen() {
        // return ; // TODO: 强制休息模式，不能退出全屏
        main.setFullScreen(false);
    }
    static openDevTools() {
        main.openDevTools();
    }

    static indexTest() {
        console.log("index.test 22");
    }

    /**
     * 设置与主进程交互的回调方法
     */
    static setMainCallback(cmd, cb) {
        this.mainCallbacks[cmd] = cb;
    }

    static getProcess() {
        return process;
    }
    static getEnv() {
        return process.env.NODE_ENV;
    }

    static isProductionEnv() {
        // console.error('process.env.NODE_ENV', process.env.NODE_ENV);
        return this.getEnv() === "production";
    }

    static getBrowserWindow() {
        return remote.BrowserWindow;
    }

    // 显示主窗口
    static showMainWindow() {
        main.showMainWindow();
    }

    static playMusic(type = "over") {
        let mediaElement = window.document.getElementById("over-music");
        mediaElement && mediaElement.play();
    }
}

webIpc.init();

module.exports = webIpc;


// 测试与主进程的通讯--ok
function test() {

    // Send async message to main process
    ipcRenderer.send("async", 1);

    // Listen for async-reply message from main process
    ipcRenderer.on("async-reply", (event, arg) => {
        // Print 2
        console.log(arg);
        // Send sync message to main process
        let mainValue = ipcRenderer.sendSync("sync", 3);
        // Print 4
        console.log(mainValue);
    });

    // Listen for main message
    ipcRenderer.on("ping", (event, arg) => {
        // Print 5
        console.log(arg);
        // Invoke method directly on main process
        main.pong(6);
    });
}

// test();
