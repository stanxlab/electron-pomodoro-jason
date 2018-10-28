
<template>
  <div>
      <el-container>
        <Header></Header>
        <el-main>
            <router-view></router-view>
        </el-main>

        <el-footer>
             <SystemInfo />
        </el-footer>
      </el-container>
  </div>
</template>


<script>
import Header from "./components/Header";
import SystemInfo from "./components/SystemInfo";
// import LayoutDemo from "./components/LayoutDemo";

export default {
  name: "app-index",
  components: { SystemInfo, Header },
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
.el-footer {
  // background-color: #b3c0d1;
  position: absolute;
  color: #333;
  text-align: center;
  line-height: 40px;
  bottom: 10px;
  width: 98%;
}

.el-main {
  position: relative;
  margin-top: 80px;
  color: #333;
  text-align: center;
  // line-height: 160px;
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



