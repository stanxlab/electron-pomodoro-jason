import Vue from "vue";
import Vuex from "vuex";

import Counter from "./modules/Counter";
import clockMain from "./modules/clockMain";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Counter,
    clockMain,
  },
  strict: process.env.NODE_ENV !== "production"
});

