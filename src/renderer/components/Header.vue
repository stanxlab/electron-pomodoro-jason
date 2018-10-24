<template>
    <el-row >
        <el-col :span="6" :offset="18">
            <el-menu
            @open="handleOpen"
            @close="handleClose">
            <el-submenu index="1">

                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>选项</span>
                </template>

                <el-menu-item index="1-1">开始集中精力</el-menu-item>
                <el-menu-item index="1-2">开始短暂休息</el-menu-item>
                <el-menu-item index="1-3">开始长时间休息</el-menu-item>
               
            </el-submenu>
            <!-- <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item> -->
      
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
import { startTypes } from "../constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>