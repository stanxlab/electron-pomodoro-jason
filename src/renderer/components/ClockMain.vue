
<template>
<div id="start-wrapper">
    <div class="header-menu">
        <el-row>
            <el-col :span="6" :offset="18">
                <el-dropdown split-button type="primary">
                    <i class="el-icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="start_work_force">开始集中精力</el-dropdown-item>
                        <el-dropdown-item @click.native="start_rest_force">开始短暂休息</el-dropdown-item>
                        <el-dropdown-item @click.native="start_rest_force">开始长时间休息</el-dropdown-item>
                        <el-dropdown-item @click.native="toSetting">设置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>

    <el-row :gutter="10" class="time-wrapper">
        <el-progress type="circle" :width="progress.diameter" :color="progressColor" :stroke-width="10" :percentage="pastPercent"></el-progress>

        <div class="center-time-wrap">
            <el-col :span="8" :offset="8">
                <div class="center-time-inner">
                    <div v-if="isWorking || isResting || isPauseing">
                        <span class="display-time" :class="timeColorClass">{{displayTime}}</span>
                    </div>
                    <div v-else>
                        <el-input v-model="setTime" size="medium" class="ipt-time" placeholder="setTime"></el-input>
                    </div>
                </div>
            </el-col>

        </div>
    </el-row>

    <el-row :gutter="20">
        <div v-if="isWorking || isResting">
            <el-button type="danger" round @click="stop()">停止</el-button>
            <el-button round @click="pause()">暂停</el-button>
        </div>
        <div v-else-if="isPauseing">
            <el-button type="danger" round @click="stop()">停止</el-button>
            <el-button type="success" round @click="toContinue()">继续</el-button>
        </div>
        <div v-else-if="isToRest">
            <el-button type="primary" @click="start_rest()">开始短暂休息</el-button>
        </div>
        <div v-else-if="isToWork">
            <el-button type="danger" @click="start_work()">开始集中精力</el-button>
        </div>
        <div v-else>
            <el-button type="danger" @click="start_work()">开始集中精力</el-button>
        </div>
    </el-row>

    <el-row :gutter="20" class="hide-">
        <el-button @click="test()">test-{{count}}--{{total}}</el-button>
        <el-button @click="increment()">Incr</el-button>
        <el-button @click="playMusic()">music</el-button>
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
        workColor: "#e54b4b", // 工作颜色
        restColor: "#05ede1" // 休息颜色
      }
    };
  },
  computed: {
    progressColor() {
      // console.log("----", this.isWorking);
      if (this.isWorking || this.isToWork) {
        return this.progress.workColor;
      } else {
        return this.progress.restColor;
      }
    },
    timeColorClass() {
      return {
        workColor: this.isWorking || this.isToWork // 是否使用 workColor 这个 class
      };
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
      isToRest: "isToRest",
      isOver: "isOver"
    })
  },
  created() {
    // 初始化给主进程用的回调方法
    webIpc.setMainCallback(startTypes.start_work_force, () => {
      console.log("主进程调用 start_work_force", this.$store.state);
      this.$router.push("/");
      this.$store.dispatch(startTypes.start_work_force);
    });
    webIpc.setMainCallback(startTypes.start_rest_force, data => {
      console.log("主进程调用 start_rest_force", data);
      this.$router.push("/");
      this.$store.dispatch(startTypes.start_rest_force);
    });
    webIpc.setMainCallback("setting", data => {
      console.log("主进程调用 setting", data);
      this.$router.push("/setting");
    });
  },
  watch: {
    // 监听是否结束了当前计时, 结束则进入到全屏,并播放音乐
    isOver(isNowOver, oldVal) {
      console.log("watch isOver: ", isNowOver, oldVal);
      if (isNowOver) {
        // 屏幕强制全屏弹出
        webIpc.setFullScreen();
        webIpc.showMainWindow();
        webIpc.playMusic("over");
      }
    }
  },
  methods: {
    ...mapActions([
      "increment",
      startTypes.stop,
      startTypes.pause,
      startTypes.toContinue,
      startTypes.start_work,
      startTypes.start_rest,
      startTypes.start_work_force,
      startTypes.start_rest_force
    ]),
    toSetting() {
      this.$router.push("/setting");
    },

    playMusic() {
      webIpc.playMusic("over");
    },
    test() {
      //
      let myNotification = new Notification("测试标题", {
        body: "右下角通知!!!"
        // dir: "auto",
        // data: { test: "tttss" }
        // icon: "./src/icon/icon_128.ico",
        // tag: "tag--"
      });
      myNotification.onclick = () => {
        console.log("通知已被点击");
      };
      // shell 模块不能用???
      // let shell = webIpc.getShell();
      // 在用户默认浏览器中打开URL的示例:
      // shell.openExternal("https://github.com");
      return;
      // 打开新窗口
      let url = "https://github.com";
      const BrowserWindowProxy = window.open(url);

      setTimeout(() => {
        BrowserWindowProxy.close();
      }, 5000);
      return;
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
  .el-progress__text {
    color: #e9eef3;
  }

  .hide {
    display: none;
  }

  // new
  .center-time-wrap {
    // border: 1px solid #9f71db; // debug
    position: absolute;
    top: 0;
    width: 100%;
    height: 360px;
  }
  .center-time-inner {
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
  span.display-time.workColor {
    color: #e54b4b;
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