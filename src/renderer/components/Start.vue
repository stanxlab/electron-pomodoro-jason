
<style lang="scss" scope>
#start-wrapper {
  .time-wrapper {
    position: relative;
  }

  // 进度条与背景颜色一致
  // .el-progress__text {
  //   color: #e9eef3;
  // }

  // new
  .center-time-wrap {
    border: 1px solid #9f71db;
    position: absolute;
    top: 0;
    width: 100%;
    height: 360px;
  }
  .center-time-inner {
    background-color: #e9eef3; // 覆盖进度条文字
    border: 1px solid #9f71db;
    height: 100px;
    line-height: 100px;
    margin-top: 130px;
    text-align: center;
  }
  span.display-time {
    text-align: center;
    line-height: 100px;
    font-size: 50px;
  }
  .ipt-time {
    width: 70px;
    text-align: center;
    font-size: 25px;
  }
  .ipt-time input {
    padding: 5px;
    text-align: center;
  }
}
</style>

<template>
    <div id="start-wrapper">
        
        <el-row :gutter="10" class="time-wrapper">
            <el-progress type="circle" :width="360" :stroke-width="10" :percentage="pastPercent"></el-progress>

            <div class="center-time-wrap" >
                  <!-- <el-col :span="8"><div class="grid-content bg-purple"></div></el-col> -->
                  <el-col :span="8" :offset="8">
                    <div class="center-time-inner" >
                      <div v-if="isWorking || isResting">
                       <span class="display-time">{{displayTime}}</span>
                      </div>
                      <div v-else>
                        <el-input v-model="setTime"  size="medium"
                            class="ipt-time" 
                        placeholder="setTime"></el-input>
                      </div> 
                  </div>
                </el-col>

            </div>
        </el-row>

        <el-row :gutter="20">
            <div v-if="isWorking || isResting">
                <el-button type="danger" v-on:click="stop()">Stop</el-button>
                <el-button type="warning" v-on:click="pause()">Pause</el-button>
            </div>
             <div v-else-if="isPauseing">
                <el-button type="primary" v-on:click="start()">Start</el-button>
                 <el-button type="danger" v-on:click="stop()">Stop</el-button>
            </div>
             <div v-else-if="isStoped">
                <el-button type="primary" v-on:click="start()">Start</el-button>
            </div>
             <div v-else>
                <el-button type="primary" v-on:click="start()">Start</el-button>
            </div>
        </el-row>

        <el-row :gutter="20">
    
          <el-button v-on:click="test()">test-{{count}}--{{total}}</el-button>
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
      progress_diameter: 360, // 进度条直径
      _timer_1: null
    };
  },
  computed: {
    setTime: {
      get() {
        return this.$store.state.Start.setTime;
      },
      set(value) {
        this.$store.commit(startTypes.updateSetTime, value);
      }
    },
    ...mapState({
      // data: state => state.Start,
      count: state => state.Start.count,
      pastPercent: state => state.Start.pastPercent,
      displayTime: state => state.Start.displayTime
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
    pause() {
      clearInterval(this._timer_1);
      this._timer_1 = null;
      return this.$store.dispatch(startTypes.pause);
    },
    start() {
      const dispatch = this.$store.dispatch;
      const state = this.$store.state.Start;

      dispatch(startTypes.start);

      dispatch(startTypes.incrPastTime);
      this._timer_1 = setInterval(() => {
        console.log(state.pastTime, state.totalTime);
        if (state.pastTime >= state.totalTime) {
          this.over();
          return;
        }
        dispatch(startTypes.incrPastTime);
      }, state.intervalGap * 1000);
    },
    over() {
      this.$store.dispatch(startTypes.over);
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