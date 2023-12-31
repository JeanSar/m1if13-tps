import {status} from "@/store/modules/status";
import { fetchResources, fetchTresors, fetchZRR } from "@/utils/apiFunction";

export const Treasure = {
  state () {
    return {
      items: [],
      closerTreasure: "Chargement ..."
    }
  },
  mutations: {
    setCloserTreasure(state, distance) {
      state.closerTreasure = Math.trunc(distance * 100) / 100;
    },
    initTreasures(state, treasures) {
      state.items = treasures;
    },
    addTreasure(state, treasure) {
      state.items.push(treasure)
    },
    updateTreasure(state, {treasure, index}) {
      state.items[index] = treasure;
    }
  },
  actions: {
    async readTreasures({commit}) {
      const res = await fetchTresors();
      if(res.status === 200) {
        commit('initTreasures', await res.json());
      }
    }
  }
}