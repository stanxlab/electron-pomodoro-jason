
<template>
    <div id="vue">
      <div>
        <el-button type="primary" v-on:click="setFullScreen()">FullScreen</el-button>
        <el-button type="warning" v-on:click="cancelFullScreen()">Cancel</el-button>
      </div> 

      <div id="setting">
        Time: 
        <el-input v-model="time" size="medium" placeholder="set time"></el-input> minute
        <el-button type="primary" v-on:click="start()">Start</el-button>
        <el-button type="warning" v-on:click="stop()">Pause</el-button>
      </div>

      <div id="progress"> 
        <el-progress type="circle" :percentage="pastPercent"></el-progress>
      </div> 

    </div>
</template>

<script>
console.log('msg from app.vue');
export default {
  data() {
    return {
      intervalTime: 1000, // 1s
      time: 1, // minute
      pastTime: 0,
      totalTime: 0,
      pastPercent: 0,
      _timer: null
    };
  },
  methods: {
    setFullScreen() {
      webIpc.setFullScreen(true);
    },
    cancelFullScreen() {
      webIpc.setFullScreen(false);
    },

    stop() {
      clearInterval(this._timer);
    },
    start() {
      clearInterval(this._timer);
      this.time = this.time | 0;
      this.totalTime = this.time * 60 * 1000;
      this._timer = setInterval(() => {
        this.pastTime += this.intervalTime;
        this.pastPercent = ((this.pastTime / this.totalTime) * 100) | 0;
        console.log(this.pastPercent, this.pastTime, this.totalTime);
        if (this.pastTime >= this.totalTime) {
          clearInterval(this._timer);
          this._timer = null;
          this.over();
        }
      }, this.intervalTime);
    },
    over() {
      this.setFullScreen();
    }
  }
};
</script>

<style lang="scss" scope>
#vue {
  h1 {
    color: #05ede1;
  }
}
</style>


