import Vue from "vue";
export default {
    state: {
        rects: {}
    },
    mutations: {
        addRect(state, { filename, rect }) {
            state.rects[filename]
                ? state.rects[filename].push(rect)
                : Vue.set(state.rects, filename, [rect])
        },
        deleteRect(state, { filename, rect }) {
            Vue.set(state.rects, filename, state.rects[filename].filter(ele => {
                return ele != rect
            }))
        },
        addTag(state, { filename, pointIndex, value }) {
            state.rects[filename][pointIndex].transcription = value;
        },
    },
    actions: {
        
    },
    getters: {
        rectPoints: (state) => (filename) => {
            return state.rects[filename]
        }
    }
}