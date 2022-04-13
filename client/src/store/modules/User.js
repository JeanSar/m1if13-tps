import {status} from "@/store/modules/status";
import { fetchResources, fetchZRR } from "@/utils/apiFunction";

export const User = {
  state () {
    return {
      loginValue: status.idle,
      token: status.idle,
      resources: {
        id: status.idle,
        url: status.idle,
        position: {
          x: status.idle,
          y: status.idle,
        },
        role: status.idle,
        ttl: status.idle,
        treasures: [],
        registered: status.idle
      }
    }
  },
  mutations: {
    setResource(state, resource) {
      state.resources = resource;
    },
    setLoginAndToken(state, {login, token}) {
      state.loginValue = login;
      state.token = token;
    }
  },
  actions: {
    async readResource ({commit}) {
      const loginValue = sessionStorage.getItem("login");
      const token = sessionStorage.getItem("token");
      commit('setLoginAndToken', {login: loginValue, token: token})
      const res = await fetchResources(loginValue, token);
      if (res.status === 200) {
        // Les ressources on été récuperées
        const resJSON = await res.json();
        commit('setResource', resJSON);
      }
      if (res.status === 400) {
        // Le nom de compte renseigné est déjà pris
        window.alert("Impossible de récupérer la ressource");
      }
    }
  }
}