import VueRouter from "vue-router";
import Login from "../pages/Login"
import Index from "../pages/Index"

export default new VueRouter({
    routes:[
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/login',
            component:Login
        },
        {
            path:'/index',
            component:Index
        }
    ]
})