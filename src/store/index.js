import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allip: 'http://113.78.192.152:9568',
  },
  mutations: {
    setPath(state) {
      state.currentPathName = sessionStorage.getItem('RouteName')
    },
  },
  actions: {},
  modules: {},
})
