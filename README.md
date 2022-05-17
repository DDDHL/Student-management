<p align="center">
	<img alt="logo" width="80" src="https://gitee.com/donghe-li/images/raw/master/student-mangement/logo.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">学生后台管理系统</h1>
<h4 align="center">基于 SpringBoot + Vue2 前后端分离的后台系统</h4>

## 系统简介

小团队开发系统

- 前端采用 Vue2、Element UI。
- 后端采用 Spring Boot、Spring Security、Redis & Jwt。
- 权限认证使用 Jwt，支持多终端认证系统。
- 支持加载动态权限菜单，可对用户类别进行权限控制。
- 高效率开发，使用代码生成器可以一键生成后端代码。
- 同步开发的还有一个移动端（[Uniapp + uViewUi](https://gitee.com/donghe-li/student-management-mobile)）。

## 系统功能

1. 角色管理：角色是系统所有操作者的类别，该功能主要针对动态角色菜单权限分配。
2. 菜单管理：配置系统菜单，按钮权限标识等，支持修改角色查看权限。
3. 日志管理：记录系统用户进行的重要数据操作，可按时间筛选与查询。
4. 文件管理：提供文件系统，可下载，用于提供 Excel 导入模板等。
5. 字典管理：对系统中经常使用的一些较为固定的数据进行维护。
6. 学生管理：系统主要用户，提供批量导入、导出功能，支持查询、编辑删除学生信息
7. 老师管理：管理老师、辅导员和领导，基本功能与学生基本一致。
8. 学校管理：管理学院、专业、年级、支持新增、编辑、删除。年级由后端自动更新。
9. 班级管理：管理学校班级，支持新增、删除、查看班级，用户需要权限才能修改。
10. 休假管理：查看小程序休假单，进行查询或者审核，审核通过后通知学生和老师。

## 演示图

<table>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/login.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/head.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/menu.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/menu1.png"/></td>
    </tr>
    ​<tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/role.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/role1.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/log.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/log1.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/file.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/dit.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/student.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/student1.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/tutor.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/school.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/school1.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/class.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/class1.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/class2.png"/></td>
    </tr>
    <tr>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/class3.png"/></td>
        <td><img src="https://gitee.com/donghe-li/images/raw/master/student-mangement/class4.png"/></td>
    </tr>
</table>
