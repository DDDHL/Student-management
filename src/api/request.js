import axios from 'axios'
// 进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import context from '../main.js'
import store from '../store'

const requests = axios.create({
  // 基础路径
  baseURL: store.state.allip,
  timeout: 30000,
})

// 配置拦截器
requests.interceptors.request.use((config) => {
  nprogress.start()
  // 请求带token
  let res = window.localStorage.getItem('user')
  if (res != null && res != '') {
    let token = JSON.parse(window.localStorage.getItem('user')).token
    config.headers.token = token
  }
  return config
})

// 对应拦截器
requests.interceptors.response.use(
  (res) => {
    //成功的回调函数
    nprogress.done()
    if (res.data.code) {
      if (res.data.code == '1001' || res.data.code == '1002') {
        context.$Message.error('登录已过期,请重新登录!')
        localStorage.removeItem('user')
        localStorage.removeItem('menus')
        context.$router.push('/login')
      } else {
        context.$Message.error(res.data.message)
        return { code: '999' }
      }
    }
    return res.data
  },
  () => {
    //失败的回调函数
    nprogress.done()
    return Promise.reject('服务器出错，请联系管理员')
  }
)
//4、对外暴露
export default requests
