// 导入封装好的axios请求文件
import requests from "./request";

// 测试接口
export const Login = (account) => {
    return  requests({
        url: '/account',
        method: 'POST',
        data:{
            pwd:account
        }
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