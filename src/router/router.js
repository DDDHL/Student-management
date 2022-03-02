import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';
Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect:'/login',
        name:'系统登录页'
    },
    {
        path:'/login',
        component:()=>import('../pages/Login'),
        name:'系统登录'
    },
    {
        path: '*',
        name: '404',
        component: () => import('../pages/404'),
    }
]

const router = new VueRouter({
  /*   mode: 'history',
    base: process.env.BASE_URL, */
    routes
})

export const setRoutes = () => {
    const storeMenus = localStorage.getItem('menus')
    if (storeMenus) {
        const manageRoute = {
            path:'/index',
            component:()=>import('../pages/Index'),
            redirect:'/welcome',
            meta:{title:"后台管理系统"},
            name:'index',
            children: []
        }
        const menus = JSON.parse(storeMenus)
        menus.forEach(item => {
            if (item.path) {
                let itemMenu = {
                    path: item.path,
                    name: item.menuName,
                    component: () => import('../pages/' + item.pagePath)
                }
                manageRoute.children.push(itemMenu)
            } else if (item.children.length) {
                item.children.forEach(item => {
                    if (item.path) {
                        let itemMenu = {
                            path: item.path,
                            name: item.menuName,
                            component: () => import('../pages/' + item.pagePath)
                        }
                        manageRoute.children.push(itemMenu)
                    }
                })
            }
        })
        const currentRouteNames = router.getRoutes().map(v => v.name)
        if (!currentRouteNames.includes(('系统主页'))) {
            router.addRoute(manageRoute)
        }
    }
}

setRoutes()

router.beforeEach((to,from,next)=>{
    // 路由守卫
    // 修改组件标题
    sessionStorage.setItem('RouteName',to.name)
    store.commit('setPath')
    document.title = to.name
    next();
})

export default router