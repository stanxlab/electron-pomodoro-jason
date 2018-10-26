// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { ipcRenderer, remote } = require("electron");
const main = remote.require("./main");

// test
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

test();

// window.setFullScreen = (isFull) => {
//     main.setFullScreen(isFull);
// };

module.exports = class webIpc {
    static setFullScreen() {
        main.setFullScreen(true);
    }
    static cancelFullScreen() {
        main.setFullScreen(false);
    }

    static indexTest() {
        console.log("index.test 22");
    }

    static getProcess() {
        return process;
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
};