import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allip: 'http://113.78.182.96:9568',
    //allip: 'http://localhost:8001',
    currentPathName: '',
    curriculumId: 0,
    classInfo: {},
    allWeekDays: [],
    allClassTime: [],
  },
  mutations: {
    setPath(state) {
      state.currentPathName = sessionStorage.getItem('RouteName')
    },
  },
  actions: {},
  modules: {},
})
