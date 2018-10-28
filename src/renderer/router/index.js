import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import LandingPage from '../components/LandingPage.vue';
import ClockMain from "../components/ClockMain.vue";
import Setting from "../components/Setting.vue";

export default new Router({
  routes: [
    // {
    // path: '*',
    // name: 'tmp',
    // component: resolve => require(['../components/LandingPage.vue'], resolve),
    // component: LandingPage,
    // children: [{
    //   path: '/',
    //   component: resolve => require(['../components/page/Readme.vue'], resolve)
    // }]
    // },
    {
      path: '/',
      component: ClockMain,
    },
    {
      path: '/setting',
      component: Setting,
    },
    {
      path: '/landing',
      component: LandingPage,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
