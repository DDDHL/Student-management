// 导入封装好的axios请求文件
import requests from "./request";

// 测试接口
export const Test = () => {
    return  requests({
        url: '/user/login',
        method: 'POST',
        data:{userAccount:123456,password:123456}
    })
}

// 登录接口
export const login = (query) => {
    return  requests({
        url: '/user/login',
        method: 'POST',
        params:{userAccount:query.account,password:query.pwd,rememberMe:query.rememberMe}
    })
}

export const Test1 = () => {
    return  requests({
        url: '/hello',
        method: 'POST',
    })
}

// 主页侧边栏接口
export const navList =() => {
    return requests({
        url:'/navList',
        method:'GET'
    })
}

// 学生列表接口
export const students = (queryInfo) =>{
    return requests({
        url:'/students',
        method:'GET',
        params:{
            _limit:queryInfo.pageSize
        }
    })
}