// global webIpc test.
webIpc.indexTest();

// ts 部分代码文件  test
// import "./test.ts";

// Vue 代码

// 这种引入方式不能使用 store
// import Vue from "vue/dist/common";
import Vue from "vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);


import App from "./App";
import store from "./store";
import router from "./router";

new Vue({
    components: { App },
    router,
    store,
    template: "<App/>"
}).$mount("#vue-root");