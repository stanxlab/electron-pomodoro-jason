import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import LandingPage from '../components/LandingPage.vue';

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
