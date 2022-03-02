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
// 验证是否登录
export const isLogin = () => {
    return requests({
        url:'/admin/verify',
        method:'POST'
    })
}
// 学生管理获取列表
export const getAll = () => {
    return requests({
        url:'/getAll',
        method:'GET',
    })
}
// 获取自己信息
export const getMyInfo = () => {
    return requests({
        url:'/user/getById',
        method:'POST',
        data:{}
    })
}
// 修改个人信息
export const changeUserInfo = (query) => {
    return requests({
        url:'/user/edit',
        method:'POST',
        data:query
    })
}
// 修改密码
export const changPwd = (newPassword,password) => {
    return requests({
        url:'/user/edit',
        method:'POST',
        data:{newPassword:newPassword,password:password}
    })
}
// 登录接口
export const login = (query,pwd) => {
    return  requests({
        url: '/admin/login',
        method: 'POST',
        data:{userAccount:query.account,password:pwd,rememberMe:query.rememberMe}
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

// 侧边栏动态加载
export const getMenus =() => {
    return requests({
        url:'/menus',
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