<template>
    <div class="header-menu">
        <el-row>
            <el-col :span="4" :offset="20">
                <el-dropdown split-button type="primary">
                    <i class="el-icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="start_work_force">开始集中精力</el-dropdown-item>
                        <el-dropdown-item @click.native="start_rest_force">开始短暂休息</el-dropdown-item>
                        <el-dropdown-item @click.native="start_rest_force">开始长时间休息</el-dropdown-item>
                        <el-dropdown-item @click.native="toSetting">设置</el-dropdown-item>
                        <el-dropdown-item @click.native="toHome">首页</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { startTypes } from "../constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
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
  methods: {
       ...mapActions([
      startTypes.start_work_force,
      startTypes.start_rest_force
    ]),
    toSetting() {
      this.$router.push("/setting");
    },
    toHome() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="scss" scope>
.header-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  line-height: 60px;
  width: 100%;
}
</style>