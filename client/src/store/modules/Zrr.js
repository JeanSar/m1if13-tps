import {status} from "@/store/modules/status";
import { fetchZRR } from "@/utils/apiFunction";

export const Zrr = {
    state () {
        return {
            limite_NE: {
                x: status.idle,
                y: status.idle,
            },
            limite_NO: {
                x: status.idle,
                y: status.idle,
            },
            limite_SE: {
                x: status.idle,
                y: status.idle,
            },
            limite_SO: {
                x: status.idle,
                y: status.idle,
            }
        }
    },
    mutations: {
        setZrr(state, { limite_NE, limite_NO, limite_SE, limite_SO }) {
            state.limite_NE = limite_NE;
            state.limite_NO = limite_NO;
            state.limite_SE = limite_SE;
            state.limite_SO = limite_SO;
        }
    },
    actions: {
        async readZrr ({commit}, payload) {
            const res = await fetchZRR();
            if (res.status === 200) {
                // Les ressources on été récuperées
                const resJSON = await res.json();
                commit('setZrr', resJSON);
            }
            if (res.status === 400) {
                // Le nom de compte renseigné est déjà pris
                window.alert("Impossible de récupérer la ZRR");
            }
        }
    }
}