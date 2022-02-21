import axios from 'axios'
// 进度条
import nprogress from "nprogress"
import "nprogress/nprogress.css"

const requests = axios.create({
    // 基础路径
    baseURL:'http://localhost:8080',
    timeout:3000,
    // 请求头
    /* headers:{} */
})

// 配置拦截器
requests.interceptors.request.use(config => {
    nprogress.start()
    // 请求带token
    /* config.headers.Authorization = window.sessionStorage.getItem('token') */
    return config
})

// 对应拦截器
requests.interceptors.response.use((res) => {
    //成功的回调函数
    nprogress.done()
    return  res.data;
},() => {
    //失败的回调函数
    nprogress.done()
    return Promise.reject('fail')
})
//4、对外暴露
export default requests;
