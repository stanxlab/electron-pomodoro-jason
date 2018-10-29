<template>
<div id="setting-wrapper">
  <el-row :gutter="10">
    <el-col :span="8" :offset="8">
      <h3>集中精力时间: </h3>
      <el-form :inline="true" :model="workForm" class="demo-form-inline">
        <el-form-item label="持续时间">
          <el-input v-model="workForm.time" placeholder="xx分钟"></el-input>
        </el-form-item>
        <!-- <el-form-item label="其他">
          <el-input v-model="workForm.t1" placeholder=""></el-input>
        </el-form-item> -->
      </el-form>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="8" :offset="8">
      <h3>短暂休息时间: </h3>
      <el-form :inline="true" :model="restForm" label-position="right" class="demo-form-inline">
        <el-form-item label="持续时间">
          <el-input v-model="restForm.time" placeholder="xx分钟"></el-input> 
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  
  <el-row :gutter="10">
    <el-col :span="8" :offset="8">
      <h3>长时间休息时间: </h3>
      <el-form :inline="true" :model="longRestForm" label-position="right" class="demo-form-inline">
        <el-form-item label="持续时间">
          <el-input v-model="longRestForm.time" placeholder="xx分钟"></el-input> 
        </el-form-item>
        <el-form-item label="test">
          <el-select v-model="longRestForm.slt2" placeholder="test">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="test">test</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <el-row :gutter="10">
    <img class="logo" src="../assets/G-1.png" alt="image test">
  </el-row>

</div>
</template>

<script>
export default {
  data() {
    return {
      workForm: {
        time: this.$store.state.clockMain.config.workTime,
        t1: ""
      },
      restForm: {
        time: this.$store.state.clockMain.config.shortRestTime,
        slt2: ""
      },
      longRestForm: {
        time: this.$store.state.clockMain.config.longRestTime,
        slt2: ""
      }
    };
  },
  watch: {
    // 监听表单数据变化, 直接保存配置
    "workForm.time"(val, oldVal) {
      console.log("---workForm.time", val, oldVal);
      this.$store.dispatch("setConfig", { field: "workTime", value: val });
    },
    "restForm.time"(val, oldVal) {
      console.log("---restForm.time", val, oldVal);
      this.$store.dispatch("setConfig", { field: "shortRestTime", value: val });
    },
    "longRestForm.time"(val, oldVal) {
      console.log("---restForm.time", val, oldVal);
      this.$store.dispatch("setConfig", { field: "longRestTime", value: val });
    }
  },
  methods: {
    test() {
      alert("test222");
    }
  }
};
</script>

<style lang="scss" scope>
#setting-wrapper {
  .el-col {
    border: 1px solid rgb(113, 149, 182);
  }

  .logo {
    height: auto;
    margin-bottom: 20px;
    width: 128px;
  }

  h3 {
    color: #e54b4b;
    padding: 10px;
  }
}
</style>
