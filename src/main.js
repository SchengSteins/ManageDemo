import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/less/index.less'

import router from '../router'
import store from '../store'
import http from 'axios'
import '../api/mock'
import SocketIO from "vue-socket.io";
import ClientSocketIO from 'socket.io-client'

Vue.use(new SocketIO({
  debug: true,
  connection: ClientSocketIO.connect('http://localhost:3000/', {
    transports: ['websocket']
  })
}))

Vue.config.productionTip = false
Vue.use(Element)

Vue.prototype.$http = http

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    store.commit('addMenu', router)
  }
}).$mount('#app')
