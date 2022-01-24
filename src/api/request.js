import axios from 'axios'
// 进度条
import nprogress from "nprogress"
import "nprogress/nprogress.css"

const requests = axios.create({
    // 基础路径
    baseURL:'http://localhost:3000',
    timeout:3000
})

// 配置拦截器
requests.interceptors.request.use(config => {
    nprogress.start()
    return config
})

// 对应拦截器
requests.interceptors.response.use((res) => {
    //成功的回调函数
    nprogress.done()
    return  res.data;
},() => {
    //失败的回调函数
    return Promise.reject(new Error('fail'))
})
//4、对外暴露
export default requests;
