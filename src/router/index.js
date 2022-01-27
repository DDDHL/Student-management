import VueRouter from "vue-router";

const router = new VueRouter({
    routes:[
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
        {
            path:'/index',
            component:()=>import('../pages/Index'),
            redirect:'/welcome',
            meta:{title:"后台管理系统"},
            children:[
                {
                    path:'/welcome',
                    component:()=>import('../pages/Welcome'),
                    meta:{title:'后台管理系统主页'}
                },
                {
                    path:'/Student',
                    component:()=>import('../pages/Student'),
                    meta:{title:'学生管理'}
                },
                {
                    path:'/Vacation',
                    component:()=>import('../pages/Vacation'),
                    meta:{title:'休假管理'}
                },
                {
                    path:'/log',
                    component:()=>import('../pages/Log'),
                    meta:{title:'系统日志'}
                },
            ]
        }
  
    ]
})

router.beforeEach((to,from,next)=>{
    // 拦截
    console.log('拦截器')
    document.title = to.meta.title
    next()
})

router.afterEach((to,from)=>{
    // 修改组件标题
    console.log(to,from)
    
})

export default router