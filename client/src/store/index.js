import { createStore } from 'vuex'
import { count } from "@/store/modules/count";
import { Zrr } from "@/store/modules/Zrr";
import { User } from "@/store/modules/User";

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
    zrr: Zrr,
    user: User
  }
})
