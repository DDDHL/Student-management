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
