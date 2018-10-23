
<template>
    <div id="start-wrapper">
        
        <el-row :gutter="10" class="time-wrapper">
            <el-progress type="circle" :width="360"  :stroke-width="10" :percentage="data.pastPercent"></el-progress>

            <div class="work-time">
                  <el-col :span="10"><div class="grid-content"></div></el-col>
                  <el-col :span="4">

                    <div v-if="isWorking || isResting">
                      <span class="ipt-time ipt-time-span">{{data.displayTime}}</span>
                    </div>
                    <div v-else>
                      <el-input v-model="data.setTime"  size="medium"
                          class="ipt-time" 
                      placeholder="setTime"></el-input>
                    </div> 
         
                </el-col>
                <el-col :span="10"><div class="grid-content"></div></el-col>
            </div>
        </el-row>

        <el-row :gutter="20">
            <div v-if="isWorking">
                <el-button type="warning" v-on:click="stop()">Stop</el-button>
            </div>
             <div v-else-if="isResting">
                <el-button type="primary" v-on:click="start()">Start</el-button>
            </div>
             <div v-else>
                <el-button type="primary" v-on:click="start()">Start</el-button>
            </div>
        </el-row>

        <el-row :gutter="20">
    
          <el-button v-on:click="test()">test-{{data.count}}--{{total}}</el-button>
          <el-button v-on:click="increment()">Incr</el-button>
        
        </el-row>

    </div>
</template>

<script>
import { startTypes } from "../constants";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      _timer_1: null
    };
  },
  computed: {
    ...mapState({
      data: state => state.Start
    }),
    ...mapGetters({
      total: "cartTotal",
      isWorking: "isWorking",
      isResting: "isResting",
      isPauseing: "isPauseing",
      isStoped: "isStoped"
    })
  },
  created() {},
  methods: {
    ...mapActions(["increment"]),
    setFullScreen() {
      webIpc.setFullScreen(true);
    },
    cancelFullScreen() {
      webIpc.setFullScreen(false);
    },

    stop() {
      clearInterval(this._timer_1);
      this._timer_1 = null;
      return this.$store.dispatch(startTypes.stop);
    },
    start() {
      const dispatch = this.$store.dispatch;
      const state = this.$store.state.Start;

      dispatch(startTypes.start_work);
      console.log("====", state, state.pastTime, state.totalTime);
      if (state.pastTime >= state.totalTime) {
        this.over();
        return;
      }
      dispatch(startTypes.incrPastTime);
      this._timer_1 = setInterval(() => {
        dispatch(startTypes.incrPastTime);
      }, state.intervalGap * 1000);
    },
    over() {
      this.$store.dispatch(startTypes.stop);
      clearInterval(this._timer_1);
      this._timer_1 = null;
      // console.log(Date.now() - stime, new Date().toLocaleString());
      // 强制显示主页面
      this.setFullScreen();
      webIpc.showMainWindow();
    },

    test() {
      // shell 模块不能用???
      // let shell = webIpc.getShell();
      // 在用户默认浏览器中打开URL的示例:
      // shell.openExternal("https://github.com");
      console.log(this.workTime, this.$store.state.Start);
      return;
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
  .time-wrapper {
    position: relative;
  }

  // 进度条与背景颜色一致
  .el-progress__text {
    color: #e9eef3;
  }
  .ipt-time {
    width: 80px;
    background-color: #e9eef3;
    text-align: center;
    height: 80px;
    font-size: 20px;
  }
  .ipt-time-span {
    text-align: center;
    background-color: #e9eef3;
    line-height: 50px;
    font-size: 50px;
  }

  .work-time {
    position: absolute;
    width: 100%;
    top: 150px;
    text-align: center;
  }
}
</style>