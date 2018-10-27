
<template>
    <div id="vue-root">
      <el-container>
        <!-- <el-header style="z-index:999;"><Header/></el-header> -->
        <el-container>
            <!-- <el-aside width="100px">
              Aside
            </el-aside> -->

            <el-main>
               <ClockMain />
            </el-main>
        </el-container>

        <el-footer>
             <SystemInfo />
        </el-footer>
      </el-container>
    </div>
</template>


<script>
console.log("msg from app.vue");
import ClockMain from "./components/ClockMain";
import Header from "./components/Header";
import SystemInfo from "./components/SystemInfo";
// import LayoutDemo from "./components/LayoutDemo";

export default {
  name: "app-index",
  components: { ClockMain, SystemInfo, Header },
  methods: {
    test() {
      console.log("appp: ", this.$store);
    }
  }
};
</script>

<style lang="scss" scope>
body {
  background-color: #e9eef3;
}

// rongqi
.el-header {
  text-align: center;
  line-height: 40px;
}
.el-footer {
  // background-color: #b3c0d1;
  position: absolute;
  color: #333;
  text-align: center;
  line-height: 40px;
  bottom: 10px;
  width: 98%;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  color: #333;
  text-align: center;
  // line-height: 160px;
}

// body > .el-container {
//   margin-bottom: 40px;
// }

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

// buju

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>



