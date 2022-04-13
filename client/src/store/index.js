import { createStore } from 'vuex'
import { count } from "@/store/modules/count";
import { Zrr } from "@/store/modules/Zrr";

export default createStore({
  state() {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    count: count,
    zrr: Zrr
  }
})
