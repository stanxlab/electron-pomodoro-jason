
// global webIpc test.
webIpc.indexTest();

// ts 部分代码文件
import './test.ts';



// Vue 

import Vue from 'vue/dist/vue.js';
// import Vue from 'vue';


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App';

Vue.use(ElementUI);

new Vue({
    components: { App },
    // router,
    // store,
    template: '<App/>'
}).$mount('#vue-root');