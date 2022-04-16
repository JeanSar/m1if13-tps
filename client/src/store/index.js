import { createStore } from 'vuex'
import { count } from "@/store/modules/count";
import { Zrr } from "@/store/modules/Zrr";
import { User } from "@/store/modules/User";
import { Treasure } from "@/store/modules/Treasure";

export default createStore({
  state() {
    return {
      showPopUp: true
    }
  },
  getters: {

  },
  mutations: {
    setShowPopUp(state, value) {
      state.showPopUp = value;
    }
  },
  actions: {

  },
  modules: {
    count: count,
    zrr: Zrr,
    user: User,
    treasures: Treasure
  }
})
