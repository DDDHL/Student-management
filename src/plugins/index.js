import Vue from 'vue'
// login及index最外层
import {
  Button,
  Row,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Header,
  Footer,
  Aside,
  Main,
  Col,
} from 'element-ui'
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
import { MenuItem, Menu, Submenu, MenuItemGroup, Tooltip } from 'element-ui'
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Tooltip)

// 面包屑
import { Breadcrumb, BreadcrumbItem } from 'element-ui'
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

// 卡片及表格
import { Card, Table, TableColumn, Pagination } from 'element-ui'
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)

// 头部下拉菜单
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

// 修改用户信息弹窗
import { Dialog, Select, Option, TabPane, Tabs } from 'element-ui'
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(TabPane)
Vue.use(Tabs)

// 头像
import { Avatar, Upload } from 'element-ui'
Vue.use(Avatar)
Vue.use(Upload)

// 弹出框
import { Popover, Checkbox } from 'element-ui'
Vue.use(Popover)
Vue.use(Checkbox)

// 菜单页面
import { Popconfirm, MessageBox } from 'element-ui'
Vue.use(Popconfirm)
Vue.prototype.$confirm = MessageBox.confirm

// 用户管理页面
import { Tree } from 'element-ui'
Vue.use(Tree)

// 日志页面
import { DatePicker } from 'element-ui'
Vue.use(DatePicker)

// 班级页面
import { Drawer } from 'element-ui'
Vue.use(Drawer)
import { Loading, InputNumber, Tag, Divider } from 'element-ui'
Vue.use(Loading)
Vue.use(InputNumber)
Vue.use(Tag)
Vue.use(Divider)
