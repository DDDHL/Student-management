/* import Vue from 'vue' */
import VueRouter from 'vue-router'

/* Vue.use(VueRouter) */

const routes = [
    {
        path:'/',
        redirect:'/login',
        meta:{title:"系统登录页"}
    },
    {
        path:'/login',
        component:()=>import('../pages/Login'),
        meta:{title:"系统登录页"}
    },
    /* {
        path: '*',
        name: '404',
        component: () => import('../views/404'),
    }, */
]

const router = new VueRouter({
    routes
})

export const setRoutes = (storeMenus) => {
    if (storeMenus) {
        const manageRoute = {
            path:'/index',
            component:()=>import('../pages/Index'),
            redirect:'/welcome',
            meta:{title:"后台管理系统"},
            children: []
        }
        /* const menus = JSON.parse(storeMenus) */
        storeMenus.forEach(item => {
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
        if (!currentRouteNames.includes(('index'))) {
            router.addRoute(manageRoute)
        }
    }
}

setRoutes()

export default router