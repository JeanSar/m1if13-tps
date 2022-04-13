export const count = {
  state() {
      return {
        count: 0
      }
    },
    getters: {

    },
    mutations: {
      increment (state, value = 1) {
        state.count += value
      }
    },
    actions: {
      incrementNFois ({commit}, payload) {
        commit('increment', payload.n);
      }
    }
}