const idle = 'idle';

const Zrr = {
    state () {
        return {
            limite_NE: {
                x: idle,
                y: idle,
            },
            limite_NO: {
                x: idle,
                y: idle,
            },
            limite_SE: {
                x: idle,
                y: idle,
            },
            limite_SO: {
                x: idle,
                y: idle,
            }
        }
    },
    mutations: {
        setZrr(NE, NO, SE, SO) {
            state.limite_NE = NE;
            state.limite_NO = NO;
            state.limite_SE = SE;
            state.limite_SO = SO;
        }
    }
}