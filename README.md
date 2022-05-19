<p align="center">
	<img alt="logo" width="80" src="https://img-blog.csdnimg.cn/f175e8d454a24b588726290b74a317c8.png">
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
        <td><img src="https://img-blog.csdnimg.cn/2cf616982d6340dbbab10c7429416ef2.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/be23a098bc414aa28e4c2243d34e2aee.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/cbd1de96905f49919defecc18a01d58c.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/420b8cf0b74d4071925b317c9a593661.png"/></td>
    </tr>
    ​<tr>
        <td><img src="https://img-blog.csdnimg.cn/1b2b0f7d16b84602b21557a7b90a44be.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/49d4181047c149d7baabc062f0c84b45.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/8a993b97607841b99b2011c197348604.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/ff4f1467aaf8407cbf09829fcef3f3a3.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/6b6bc7a637834793a7912e80f7f96fef.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/9bd29a1e316746dd89ee93e6b37ac0d3.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/2c1f79f4ce1d4ca7845f716564d535a7.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/cefc91f065764b63a9add086dbb163b1.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/802a7db5ad674c1cb5eb643d7b9b6664.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/71080aef5f8043bbad48cea8c996d9f5.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/c3b93611a2914979889aba107124e4cf.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/8bee9571d8a244cab4c295c96f38a321.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/d64e7e7d631649bbbb3afe9268c37627.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/c82d50985db64e489ba3682042ae1806.png"/></td>
    </tr>
    <tr>
        <td><img src="https://img-blog.csdnimg.cn/841a4abb829f44abb163b3d1137319f2.png"/></td>
        <td><img src="https://img-blog.csdnimg.cn/63935517ba3141f49c44ada55e79f2cd.png"/></td>
    </tr>
</table>
