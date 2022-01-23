import axios from 'axios'

const requests = axios.create({
    // 基础路径
    baseURL:'http://localhost:3000',
    timeout:3000
})

// 配置拦截器
requests.interceptors.request.use(config => {
    return config
})

// 对应拦截器
requests.interceptors.response.use((res) => {
    //成功的回调函数
    return  res.data;
},() => {
    //失败的回调函数
    return Promise.reject(new Error('fail'))
})
//4、对外暴露
export default requests;
