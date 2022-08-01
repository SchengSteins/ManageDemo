import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import user from './user'
import mark from './mark'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        tab,
        user,
        mark
    }
})