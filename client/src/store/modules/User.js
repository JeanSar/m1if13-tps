import {status} from "@/store/modules/status";
import { fetchResources, fetchZRR } from "@/utils/apiFunction";

export const User = {
  state () {
    return {
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
        registered: false
      }
    }
  },
  mutations: {
    setResource(state, resource) {
      const {ttl, ...other} = resource;
      state.resources.id = other.id;
      state.resources.url = other.url;
      state.resources.registered = other.registered;
      state.resources.treasures = other.treasures;
      state.resources.position = other.position;
      state.resources.role = other.role;
      this.commit("setTTL", ttl);
      state.resources = resource;
    },
      setCurrentResource(state, resource) {

      this.commit("setTTL", resource.ttl);
      // state.resources.ttl = resource.ttl;
      state.resources.registered = resource.registered;
      state.resources.url = resource.url;
      state.resources.treasures = resource.treasures;
    },
    movePlayer(state, {x, y}) {
      const tmp = {... state.resources};
      let newPos = tmp.position;
      newPos.x += x;
      newPos.y += y;
      state.resources = {... state.resources, position: newPos}
    },
    setPosition(state, position) {
      state.resources.position =  position;
    },
    decreaseTTL(state) {
      if(typeof state.resources.ttl === "number" ) {
        this.commit("setTTL", state.resources.ttl = state.resources.ttl - 1);
      }
    },
    setTTL(state, ttl) {
      if(ttl === 0 && typeof state.resources.ttl === "number") {
        console.log("Vibration");
        window.navigator.vibrate(1000);
        state.resources.ttl = "Partie terminée";
      } else if(typeof state.resources.ttl === "number"){
        state.resources.ttl = ttl;
      }
    }
  },
  actions: {
    async initResource ({commit}) {
      const loginValue = sessionStorage.getItem("login");
      const token = sessionStorage.getItem("token");
      const res = await fetchResources(loginValue, token);
      if (res.status === 200) {
        // Les ressources on été récuperées
        const resJSON = await res.json();
        console.log(resJSON.position);
        commit('setResource', resJSON);
        sessionStorage.setItem("imageURL", resJSON.url);
      }
      if (res.status === 400) {
        window.alert("Impossible de récupérer la ressource");
      }
    },
    async readResource ({commit}) {
      const loginValue = sessionStorage.getItem("login");
      const token = sessionStorage.getItem("token");
      const res = await fetchResources(loginValue, token);
      if (res.status === 200) {
        // Les ressources on été récuperées
        const resJSON = await res.json();
        commit('setCurrentResource', resJSON);
        sessionStorage.setItem("imageURL", resJSON.url);
      }
      if (res.status === 400) {
        window.alert("Impossible de récupérer la ressource");
      }
    },

  }
}