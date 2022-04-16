import { createStore } from 'vuex'
import { count } from "@/store/modules/count";
import { Zrr } from "@/store/modules/Zrr";
import { User } from "@/store/modules/User";
import { Treasure } from "@/store/modules/Treasure";

export default createStore({
  state() {
    return {
      compteur: 1
    }
  },
  getters: {
    condition(state) {
      return state.compteur === 0;
    }
  },
  mutations: {
    setShowPopUp(state, value) {
      state.showPopUp = value;
    },
    incrementCompteur(state) {
      state.compteur ++;
    },
    decrementCompteur(state) {
      state.compteur --;
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
