import Vue from "vue";
import Vuex from "vuex";

import Counter from "./modules/Counter";
import Start from "./modules/Start";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Counter,
    Start,
  },
  strict: process.env.NODE_ENV !== "production"
});

