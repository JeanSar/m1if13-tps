import {status} from "@/store/modules/status";

const Zrr = {
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
        setZrr(NE, NO, SE, SO) {
            status.limite_NE = NE;
            status.limite_NO = NO;
            status.limite_SE = SE;
            status.limite_SO = SO;
        }
    }
}