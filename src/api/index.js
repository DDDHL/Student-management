// 导入封装好的axios请求文件
import requests from "./request";

// 测试接口
export const test = () => {
    return  requests({
        url: '/psts',
        method: 'GET'
    })
}
