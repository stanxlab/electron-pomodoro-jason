<template>
    <div id="system-info">
        <el-row :gutter="10">
            <el-col :span="6">
              <div class="grid-content bg-purple title">
                  SystemInformation:
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                 Node.js {{process.versions.node}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                Chromium {{process.versions.chrome}}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                Electron {{process.versions.electron}}
              </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: "system-info",
  data() {
    return {
      process: webIpc.getProcess()
    };
  }
};
</script>


<style lang="scss" scope>
#system-info {
  //   position: fixed;
  //   bottom: 10px;

  .title {
    color: #05ede1;
  }
}
</style>
