
<template>
    <div id="start-wrapper">
        
        <el-row :gutter="20">
            <el-progress type="circle" :width="360"  :stroke-width="10" :percentage="pastPercent"></el-progress>
        </el-row>

        <el-row :gutter="20">
          <div v-if="isRuning">
            <el-input v-model="displayTime" width="30px" size="medium"
                class="ipt-time" :disabled="true"
             placeholder="displayTime"></el-input>
          </div>
          <div v-else>
            <el-input v-model="workTime" width="30px" size="medium"
                class="ipt-time"
             placeholder="workTime"></el-input>
          </div>   
        </el-row>

        <el-row :gutter="20">
            <div v-if="isRuning">
                <el-button type="warning" v-on:click="stop()">Pause</el-button>
            </div>
             <div v-else>
                <el-button type="primary" v-on:click="start()">Start</el-button>
            </div>
        </el-row>

        <el-row :gutter="20">
    
                <el-button v-on:click="test()">test</el-button>
        
        </el-row>

    </div>
</template>

<script>
let stime = 0;
export default {
  name: "start",
  data() {
    return {
      intervalTime: 1000, // 1s
      workTime: localStorage.getItem("workTime") || 25, // minute
      displayTime: "",
      pastTime: 0,
      totalTime: 0,
      pastPercent: 0,
      isRuning: false,
      _timer: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    setFullScreen() {
      webIpc.setFullScreen(true);
    },
    cancelFullScreen() {
      webIpc.setFullScreen(false);
    },

    stop() {
      this.isRuning = false;
      this.displayTime = "";
      clearInterval(this._timer);
    },
    start() {
      stime = Date.now();
      console.log("start: ", new Date().toLocaleString());
      clearInterval(this._timer);
      this.isRuning = true;
      this.workTime = this.workTime | 0;
      this.totalTime = this.workTime * 60 * 1000;
      this.displayTime = this._toTimeString(this.totalTime);

      this._timer = setInterval(() => {
        // 剩余时间倒计时
        this.displayTime = this._toTimeString(this.totalTime - this.pastTime);
        this.pastTime += this.intervalTime;
        this.pastPercent = parseFloat(
          ((this.pastTime / this.totalTime) * 100).toFixed(2)
        );
        // console.log(this.pastPercent, this.pastTime, this.totalTime);
        if (this.pastTime >= this.totalTime) {
          clearInterval(this._timer);
          this._timer = null;
          this.over();
        }
      }, this.intervalTime);
    },
    over() {
      this.isRuning = false;
      console.log(Date.now() - stime, new Date().toLocaleString());
      // 强制显示主页面
      this.setFullScreen();
      webIpc.showMainWindow();
    },
    _toTimeString(timeMs) {
      let second = timeMs / 1000;
      let remainSecond = second;
      let hour = (remainSecond / 60 / 60) | 0;
      remainSecond -= hour ? hour * 3600 : 0;
      let minute = (remainSecond / 60) | 0;
      remainSecond -= minute ? minute * 60 : 0;
      // console.log(hour, minute, remainSecond, second);
      let str = "";
      str += hour ? `${this._padZero(hour)}:` : "";
      str += minute ? `${this._padZero(minute)}:` : "00:";
      str += this._padZero(remainSecond);
      return str;
    },
    _padZero(num) {
      return num < 10 ? `0${num}` : num;
    },
    test() {
      // shell 模块不能用???
      // let shell = webIpc.getShell();
      // 在用户默认浏览器中打开URL的示例:
      // shell.openExternal("https://github.com");

      // 打开新窗口
      let url = "https://github.com";
      const BrowserWindowProxy = window.open(url);

      setTimeout(() => {
        BrowserWindowProxy.close();
      }, 5000);
      return;

      // 新建窗口
      // const BrowserWindow = webIpc.getBrowserWindow();
      // var win = new BrowserWindow({ width: 800, height: 600 });
      // win.setFullScreen(true);
      // win.loadURL(url);
    }
  }
};
</script>
<style lang="scss" scope>
#start-wrapper {
  .ipt-time {
    width: 80px;
    text-align: center;
  }
}
</style>