import Vue from 'vue'
// login及index最外层
import { Button,Row,Form,Input,FormItem,Message,Container,Header,Footer,Aside,Main,Col} from 'element-ui'
Vue.use(Button)
Vue.use(Row)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Col)
Vue.prototype.$Message = Message

// index侧边栏
import {MenuItem,Menu,Submenu,MenuItemGroup,Tooltip } from 'element-ui'
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Tooltip)

// 面包屑
import {Breadcrumb,BreadcrumbItem} from 'element-ui'
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

// 卡片
import { Card } from 'element-ui'
Vue.use(Card)
