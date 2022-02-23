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
    switch(res.data.code){
        case '21001':
            return Promise.reject('用户未注册')
        case '21002':
            return Promise.reject('用户已注册')
        case '21003':
            return Promise.reject('用户名或者密码错误')
        case '21004':
            return Promise.reject('用户状态已删除')
        case '21005':
            return Promise.reject('账户已停用')
        case '21006':
            return Promise.reject('账户已离职')
        default:
            return res.data
    }
},() => {
    //失败的回调函数
    nprogress.done()
    return Promise.reject('fail')
})
//4、对外暴露
export default requests;
