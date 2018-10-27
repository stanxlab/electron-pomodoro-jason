import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import LandingPage from '../components/LandingPage.vue';
import App from '../App.vue';

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
      component: App,
    },
    {
      path: '/setting',
      component: LandingPage,
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
