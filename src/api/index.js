// 导入封装好的axios请求文件
import requests from './request'

// 获取数据
export const getData = () => {
  return requests({
    url: '/echarts/count',
    method: 'GET',
  })
}
// 审批假单
export const approval = (data) => {
  return requests({
    url: '/leave/approval',
    method: 'POST',
    data: data,
  })
}
// 获取休假单
export const getVacation = (data) => {
  return requests({
    url: '/leave/getAll',
    method: 'POST',
    data: data,
  })
}
// 辅导员管理修改绑定专业
export const editTutorMajor = (data) => {
  return requests({
    url: '/userMajor/edit',
    method: 'POST',
    data: data,
  })
}
// 班级详情修改课程信息
export const editClassInfo = (data) => {
  return requests({
    url: '/curriculum/editCurriculum',
    method: 'POST',
    data: data,
  })
}
// 班级详情修改时间
export const editClassTime = (id, weeks, weeksNumber, weeksTime) => {
  return requests({
    url: '/curriculum/editCurriculumRule',
    method: 'POST',
    data: {
      id: id,
      weeks: weeks,
      weeksNumber: weeksNumber,
      weeksTime: weeksTime,
    },
  })
}
// 班级详情批量删除学生
export const addSomeStudent = (id, data) => {
  return requests({
    url: '/curriculum-user/addStudent',
    method: 'POST',
    data: { curriculumId: id, userAccounts: data },
  })
}
// 班级详情里删除学生
export const delClassStudent = (id, data) => {
  return requests({
    url: '/curriculum-user/delStudent',
    method: 'POST',
    data: { curriculumId: id, userAccounts: data },
  })
}
// 班级管理删除课程
export const delClass = (data) => {
  return requests({
    url: '/curriculum/delCurriculum',
    method: 'POST',
    data: { ids: data },
  })
}
// 班级详情里获取学生数据
export const getClassStudents = (data) => {
  return requests({
    url: '/curriculum-user/getAll',
    method: 'POST',
    data: data,
  })
}
// 班级管理新增班级
export const addClass = (data) => {
  return requests({
    url: '/curriculum/addCurriculum',
    method: 'POST',
    data: data,
  })
}
// 修改学院或者年级或者专业名字
export const editById = (id, name) => {
  return requests({
    url: '/organization/edit',
    method: 'POST',
    data: { id: id, organizationName: name },
  })
}
// 班级管理页面获取班级
export const getClass = (data) => {
  return requests({
    url: '/curriculum/getAll',
    method: 'POST',
    data: data,
  })
}
// 学校页面添加新专业学院年级
export const addNewOrg = (data) => {
  return requests({
    url: '/organization/add',
    method: 'POST',
    data: data,
  })
}
// 学生管理懒加载获取班级
export const getAllClass = (data) => {
  return requests({
    url: '/organization/getAllClass',
    method: 'POST',
    data: { gradeId: data },
  })
}
// 分页获取日志
export const getLog = (data) => {
  return requests({
    url: '/log/getAll',
    method: 'POST',
    data: data,
  })
}
// 获取角色权限
export const rolePower = (data) => {
  return requests({
    url: '/role/roleMenu/getById',
    method: 'POST',
    data: data,
  })
}
// 新增角色
export const roleAdd = (data) => {
  return requests({
    url: '/role/add',
    method: 'POST',
    data: data,
  })
}
// 删除角色
export const roleDel = (data) => {
  return requests({
    url: '/role/del',
    method: 'POST',
    data: data,
  })
}
// 编辑角色
export const roleEdit = (data) => {
  return requests({
    url: '/role/edit',
    method: 'POST',
    data: data,
  })
}
// 获取角色管理分页
export const roleGetAll = (data) => {
  return requests({
    url: '/role/getAll',
    method: 'POST',
    data: data,
  })
}
// 获取字典类型
export const dictGetType = () => {
  return requests({
    url: '/dict/getDictTypes',
    method: 'GET',
  })
}
// 编辑字典
export const editOneDict = (data) => {
  return requests({
    url: '/dict/updateDict',
    method: 'POST',
    data: data,
  })
}
// 删除字典
export const delDict = (data) => {
  return requests({
    url: '/dict/delDict',
    method: 'POST',
    data: { ids: data },
  })
}
// 新增字典
export const addOneDict = (data) => {
  return requests({
    url: '/dict/addDict',
    method: 'POST',
    data: data,
  })
}
// 字典分页
export const dictGetAll = (data) => {
  return requests({
    url: '/dict/getAll',
    method: 'POST',
    data: data,
  })
}
// 文件下载
export const downloadFile = (data) => {
  return requests({
    url: `/file/${data}`,
    method: 'GET',
    responseType: 'blob',
  })
}
// 批量删除文件
export const delFile = (data) => {
  return requests({
    url: '/file/del/batch',
    method: 'POST',
    data: data,
  })
}
// 分页查询文件
export const getFile = (data) => {
  return requests({
    url: '/file/getAll',
    method: 'POST',
    data: data,
  })
}
// 新增或更新菜单
export const saveMenu = (data) => {
  return requests({
    url: '/menu/saveMenu',
    method: 'POST',
    data: data,
  })
}
// 删除菜单
export const delMenu = (data) => {
  return requests({
    url: '/menu/delMenu',
    method: 'POST',
    data: data,
  })
}
// 获取所有图标
export const getIcon = () => {
  return requests({
    url: '/dict/getIcons',
    method: 'POST',
  })
}
// 学生管理页面获取筛选
export const getStudentMajors = () => {
  return requests({
    url: '/user/getMajorsByDept',
    method: 'POST',
  })
}
// 学生管理页面新增用户
export const addStudent = (data) => {
  return requests({
    url: '/user/add',
    method: 'POST',
    data: data,
  })
}
// 学生页面导出excel
export const userExport = (data) => {
  return requests({
    url: `/user/export/${data}`,
    method: 'GET',
    responseType: 'blob',
  })
}
// 学生管理页面删除用户
export const delStudent = (data) => {
  return requests({
    url: '/user/del',
    method: 'POST',
    data: { ids: data },
  })
}
// 学校管理Tree
export const schoolTable = (data) => {
  return requests({
    url: '/organization/getAll',
    method: 'POST',
    data: data,
  })
}
// 添加字典类型
export const addDictType = (data) => {
  return requests({
    url: '/dict/addDictType',
    method: 'POST',
    data: data,
  })
}
// 角色管理设置权限
export const setRole = (data) => {
  return requests({
    url: '/role/roleMenu/set',
    method: 'POST',
    data: data,
  })
}
// 角色管理页面获取全部菜单
export const getAllMenusByRole = () => {
  return requests({
    url: '/menu/get',
    method: 'GET',
  })
}
// 获取菜单信息接口
export const getAllMenus = (data) => {
  return requests({
    url: '/menu/getAll',
    method: 'POST',
    data: data,
  })
}
// 验证是否登录
export const isLogin = () => {
  return requests({
    url: '/admin/verify',
    method: 'POST',
  })
}
// 学生管理获取列表
export const getAll = (data) => {
  return requests({
    url: '/user/getAll',
    method: 'POST',
    data: data,
  })
}
// 获取自己信息
export const getMyInfo = () => {
  return requests({
    url: '/user/getById',
    method: 'POST',
    data: {},
  })
}
// 修改用户信息
export const changeUserInfo = (query) => {
  return requests({
    url: '/user/edit',
    method: 'POST',
    data: query,
  })
}
// 获取全部年级
export const getAllGrade = (data) => {
  return requests({
    url: '/organization/getAllGrade',
    method: 'POST',
    data: { majorId: data },
  })
}
// 获取全部学院
export const getAllDept = () => {
  return requests({
    url: '/organization/getAllDept',
    method: 'POST',
  })
}
// 删除学院或者专业或者年级
export const delById = (data) => {
  return requests({
    url: '/organization/delete',
    method: 'POST',
    data: { id: data },
  })
}
// 获取某个学院下的某专业
export const getMajorsByDet = (data) => {
  return requests({
    url: '/organization/getMajorsByDept',
    method: 'POST',
    data: { departmentId: data },
  })
}
// 修改密码
export const changPwd = (newPassword, password) => {
  return requests({
    url: '/user/edit',
    method: 'POST',
    data: { newPassword: newPassword, password: password },
  })
}
// 登录接口
export const login = (query, pwd) => {
  return requests({
    url: '/admin/login',
    method: 'POST',
    data: {
      userAccount: query.account,
      password: pwd,
      rememberMe: query.rememberMe,
    },
  })
}

// 侧边栏动态加载
export const getMenus = () => {
  return requests({
    url: '/menus',
    method: 'GET',
  })
}

// 学生列表接口
export const students = (queryInfo) => {
  return requests({
    url: '/students',
    method: 'GET',
    params: {
      _limit: queryInfo.pageSize,
    },
  })
}
