import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
// 按需引入elementui
import './plugins'
// 全局样式
import './assets/css/global.css'
// 不渲染标签
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
Vue.config.productionTip = false

var vue = new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app')

export default vue
