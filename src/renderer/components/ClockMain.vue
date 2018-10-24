
<template>
    <div id="start-wrapper">
       <div class="header-menu">
          <el-row>
            <el-col :span="6" :offset="18">
              <el-dropdown split-button type="primary">
                <i class="el-icon-menu"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="startWork">开始集中精力</el-dropdown-item>
                    <el-dropdown-item @click.native="startRest">开始短暂休息</el-dropdown-item>
                    <el-dropdown-item>开始长时间休息</el-dropdown-item>
                </el-dropdown-menu>
             </el-dropdown>
          </el-col>
        </el-row>
       </div>

        <el-row :gutter="10" class="time-wrapper">
            <el-progress type="circle" :width="progress.diameter" :color="progressColor" :stroke-width="10" :percentage="pastPercent"></el-progress>

            <div class="center-time-wrap" >
                  <!-- <el-col :span="8"><div class="grid-content bg-purple"></div></el-col> -->
                  <el-col :span="8" :offset="8">
                    <div class="center-time-inner" >
                      <div v-if="isWorking || isResting || isPauseing">
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
                <el-button v-on:click="stop()">停止</el-button>
                <el-button  v-on:click="pause()">暂停</el-button>
            </div>
             <div v-else-if="isPauseing">
                <el-button v-on:click="stop()">停止</el-button>
                <el-button v-on:click="toContinue()">继续</el-button>
            </div>
             <div v-else-if="isToRest">
                <el-button type="primary" v-on:click="startRest()">开始短暂休息</el-button>
            </div>
             <div v-else-if="isToWork">
                <el-button type="danger" v-on:click="startWork()">开始集中精力</el-button>
            </div>
             <div v-else>
                <el-button type="danger" v-on:click="startWork()">开始集中精力</el-button>
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
      progress: {
        diameter: 360, // 进度条直径
        workColor: "#E54B4B", // 工作颜色
        restColor: "#05ede1" // 休息颜色
      }
    };
  },
  computed: {
    progressColor() {
      // console.log("----", this.isWorking);
      if (this.isWorking) {
        return this.progress.workColor;
      } else {
        return this.progress.restColor;
      }
    },
    setTime: {
      get() {
        return this.$store.state.clockMain.setTime;
      },
      set(value) {
        console.log(`设置新时间: ${value}`);
        this.$store.commit(startTypes.updateSetTime, value);
      }
    },
    ...mapState({
      // data: state => state.Start,
      count: state => state.clockMain.count,
      pastPercent: state => state.clockMain.pastPercent,
      displayTime: state => state.clockMain.displayTime
    }),
    ...mapGetters({
      total: "cartTotal",
      isWorking: "isWorking",
      isResting: "isResting",
      isPauseing: "isPauseing",
      isToWork: "isToWork",
      isToRest: "isToRest"
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
      return this.$store.dispatch(startTypes.stop);
    },
    pause() {
      return this.$store.dispatch(startTypes.pause);
    },
    toContinue() {
      this.$store.dispatch(startTypes.continue);
      // this._startInterval();
    },
    startWork() {
      this.$store.dispatch(startTypes.start_work);
      //this._startInterval();
    },
    startRest() {
      this.$store.dispatch(startTypes.start_rest);
      //this._startInterval();
    },

    over() {
      // console.log(Date.now() - stime, new Date().toLocaleString());
      // 强制显示主页面
      // this.setFullScreen();
      // webIpc.showMainWindow();
    },
    test() {
      // shell 模块不能用???
      // let shell = webIpc.getShell();
      // 在用户默认浏览器中打开URL的示例:
      // shell.openExternal("https://github.com");
      console.log(this.workTime, this.$store.state.clockMain);
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
  .header-menu {
    position: absolute;
    top: 10px;
    right: 10px;
    line-height: 60px;
    width: 100%;
  }

  .time-wrapper {
    position: relative;
    margin-top: 80px;
  }

  // 进度条与背景颜色一致
  // .el-progress__text {
  //   color: #e9eef3;
  // }

  // new
  .center-time-wrap {
    // border: 1px solid #9f71db; // debug
    position: absolute;
    top: 0;
    width: 100%;
    height: 360px;
  }
  .center-time-inner {
    background-color: #e9eef3; // 覆盖进度条文字
    // border: 1px solid #9f71db; // debug
    height: 100px;
    line-height: 100px;
    margin-top: 130px;
    text-align: center;
  }
  span.display-time {
    text-align: center;
    line-height: 100px;
    font-size: 50px;
    color: #05ede1;
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