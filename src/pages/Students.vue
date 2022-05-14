<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索学号或者名字"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 350px"
        @blur="blurSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>
      <!-- 添加用户 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="centerDialogVisibleAdd = true"
        >添加学生<i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 添加学生弹窗 -->
      <el-dialog
        title="添加学生"
        :visible.sync="centerDialogVisibleAdd"
        width="430px"
        center
      >
        <!-- 添加学生表单 -->
        <el-form
          :model="newStudent"
          label-width="65px"
          ref="newStudent"
          :rules="rules"
          style="margin-left: -10px"
        >
          <el-form-item label="学号" prop="userAccount">
            <el-input v-model="newStudent.userAccount"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="newStudent.nickName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="newStudent.sex"
              placeholder="请选择性别"
              style="width: 325px"
            >
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="department">
            <el-input v-model="newStudent.department" disabled></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-select
              v-model="newStudent.major"
              placeholder="请选择专业"
              style="width: 325px"
            >
              <el-option
                v-for="item in majorData"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                @click.native="addStudentGetMj(item.id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-select
              v-model="newStudent.grade"
              placeholder="请先选择专业"
              style="width: 325px"
            >
              <el-option
                v-for="item in addMajorData"
                :key="item.organizationName"
                :label="item.organizationName"
                @click.native="addStudentGetMjClass(item.id)"
                :value="item.organizationName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" required>
            <el-select
              v-model="newStudent.majorClass"
              placeholder="请先选择年级"
              style="width: 325px"
            >
              <el-option
                v-for="item in addMajorClass"
                :key="item.organizationName"
                :label="item.organizationName"
                :value="item.organizationName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="newStudent.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="newStudent.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('newStudent')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 删除学生 -->
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的学生"
        v-model="delPoppover"
      >
        <el-button
          type="danger"
          style="margin: 20px 0 0 20px"
          slot="reference"
          @click="delBtn"
          >批量删除<i class="el-icon-remove-outline"></i>
        </el-button>
      </el-popover>
      <el-dialog title="警告" :visible.sync="dialogVisibleDel" width="30%">
        <span>你确定要删除勾选的学生吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导入导出 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px; width: 98px"
        @click="uploadDialog = true"
        >导入 <i class="el-icon-top"></i>
      </el-button>
      <el-dialog
        title="Excel导入（请按照模板进行导入）"
        :visible.sync="uploadDialog"
        width="30%"
      >
        <span class="uploadContent">
          <el-button type="warning" @click="downloadMuban">下载模板</el-button>
          <el-upload
            :action="this.$store.state.allip + '/user/import'"
            style="display: inline-block"
            class="ml-5"
            :show-file-list="false"
            :accept="'xlsx'"
            :on-success="handleExcelImportSuccess"
            :headers="upLoadHeader"
            :data="upLoadData"
          >
            <el-button type="primary" style="margin: 0 0 0 20px; width: 98px"
              >导入 <i class="el-icon-top"></i>
            </el-button>
          </el-upload>
          <el-dialog
            title="警告"
            :visible.sync="dialogVisibleImport"
            width="30%"
            center
          >
            <span>{{ importError }}</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisibleImport = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisibleImport = false"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 导出 -->
      <el-popconfirm title="确定导出所有数据吗？" @confirm="exp">
        <el-button
          slot="reference"
          type="primary"
          style="margin: 20px 0 0 20px; width: 98px"
          width="200"
          >导出 <i class="el-icon-bottom"></i
        ></el-button>
      </el-popconfirm>
      <!-- 表格 -->
      <el-table
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
        stripe
        @filter-change="filterChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" align="center">
        </el-table-column>

        <el-table-column
          prop="userAccount"
          label="学号"
          sortable
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="姓名"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="department"
          label="学院"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="grade"
          label="年级"
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          align="center"
          :filters="majorData"
          column-key="filterTag"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)"
              >编辑信息<i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑学生弹窗 -->
      <el-dialog
        title="编辑学生信息"
        :visible.sync="centerDialogVisibleEdit"
        width="430px"
        center
      >
        <!-- 编辑学生表单 -->
        <el-form
          :model="editStudent"
          label-width="65px"
          ref="editStudent"
          :rules="rules"
          style="margin-left: -10px"
        >
          <el-form-item label="学号" prop="userAccount">
            <el-input v-model="editStudent.userAccount" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="editStudent.nickName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="editStudent.sex"
              placeholder="请选择性别"
              style="width: 325px"
            >
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <!--  <el-form-item label="年级" prop="grade">
            <el-select
              v-model="editStudent.grade"
              placeholder="请选择年级"
              style="width: 325px"
            >
              <el-option
                v-for="item in allGrade"
                :key="item.organizationName"
                :label="item.organizationName"
                :value="item.organizationName"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="学院" prop="department">
            <el-select
              v-model="editStudent.department"
              placeholder="请选择学院"
              style="width: 325px"
              disabled
            >
              <el-option
                v-for="item in allDepartment"
                :key="item.id"
                :label="item.organizationName"
                :value="item.organizationName"
                @click.native="getSomeMajors(item.id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--  <el-form-item label="专业" prop="major">
            <el-select v-model="editStudent.major" placeholder="请选择专业" style="width: 325px">
              <el-option v-for="item in SomeMajors" :key="item.id" :label="item.organizationName"
                :value="item.organizationName" @click.native="updatedGrade(item.id)"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="专业" prop="major">
            <el-select
              v-model="editStudent.major"
              placeholder="请选择专业"
              style="width: 325px"
            >
              <el-option
                v-for="item in majorData"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                @click.native="addStudentGetMj(item.id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-select
              v-model="editStudent.grade"
              placeholder="请先选择专业"
              style="width: 325px"
            >
              <el-option
                v-for="item in addMajorData"
                :key="item.organizationName"
                :label="item.organizationName"
                @click.native="addStudentGetMjClass(item.id)"
                :value="item.organizationName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级" required>
            <el-select
              v-model="editStudent.majorClass"
              placeholder="请先选择年级"
              style="width: 325px"
            >
              <el-option
                v-for="item in addMajorClass"
                :key="item.organizationName"
                :label="item.organizationName"
                :value="item.organizationName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editStudent.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editStudent.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editStudent')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
/* 获取学生列表接口 */
import {
  getAll,
  addStudent,
  delStudent,
  userExport,
  getAllGrade,
  getAllDept,
  getMajorsByDet,
  changeUserInfo,
  getStudentMajors,
  downloadFile,
  getAllClass
} from '../api'
/* 下载文件 */

export default {
  name: 'Students',
  data() {
    /* 手机号规则 */
    var validatorPhone = function (rule, value, callback) {
      let phone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!phone.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 手机号邮箱验证
      rules: {
        phone: [{
          required: true,
          validator: validatorPhone,
          trigger: ['blur', 'change'],
        },],
        email: [{
          required: true,
          message: '邮箱地址不能为空',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change'],
        },
        ],
        major: [{
          required: true,
          message: '专业不能为空',
          trigger: ['blur', 'change'],
        },],
        department: [{
          required: true,
          message: '学院不能为空',
          trigger: ['blur', 'change'],
        },],
        nickName: [{
          required: true,
          message: '名字不能为空',
          trigger: ['change'],
        },],
        userAccount: [{
          required: true,
          message: '学号不能为空',
          trigger: ['blur', 'change'],
        },],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: ['blur', 'change'],
        },],
        grade: [{
          required: true,
          message: '年级不能为空',
          trigger: ['blur', 'change'],
        },],
      },
      // 编辑学生年级需要的id
      editStudentId: 0,
      // 新增学生年级需要的id
      newStudentId: 0,
      // 导入失败文字
      importError: '',
      // 导入失败弹窗
      dialogVisibleImport: false,
      // 增加学生弹窗
      centerDialogVisibleAdd: false,
      // 编辑学生弹窗
      centerDialogVisibleEdit: false,
      // 删除学生
      dialogVisibleDel: false,
      delPoppover: false,
      // 专业筛选
      majorData: [],
      // 文件上传数据
      upLoadData: {
        roleId: 5,
      },
      // 文件上传token
      upLoadHeader: {},
      // 编辑学生的学院
      currentDept: 0,
      // 某学院专业
      SomeMajors: [],
      // 全部学院
      allDepartment: [],
      // 全部年级
      allGrade: [],
      // 勾选的学生
      ids: [],
      // 表格数据
      total: 0,
      // 新增学生年级
      addMajorData: [],
      // 新增学生
      newStudent: {},
      // 编辑学生
      editStudent: {},
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        roleId: 5,
        majors: [],
        nickName: '',
        // 当前页
        pageNum: 1,
        // 一页展示多少条
        pageSize: 10,
        userAccount: '',
      },
      uploadDialog: false,
      addMajorClass: []
    }
  },
  watch: {
    centerDialogVisibleEdit(newValue) {
      if (!newValue) {
        // 关闭编辑就重新获取表格
        this.getData()
      }
    },
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  mounted() {
    // 获取token
    let Mytoken = JSON.parse(localStorage.getItem('user')).token
    this.upLoadHeader = {
      token: Mytoken,
    }
  },
  methods: {
    // 处理token过期
    tokenLost() {
      this.$Message.error('您的登录信息已过期,请重新登录')
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      this.$router.push('/login')
    },
    // 新增学生获取年级
    async addStudentGetMj(id) {
      // 请求年级
      let res = await getAllGrade(id)
      if (res.code == '') {
        // 赋值
        this.addMajorData = res.data
      }
    },
    // 新增学生获取班级
    async addStudentGetMjClass(id) {
      // 请求班级
      let res = await getAllClass(id)
      if (res.code == '') {
        // 赋值
        this.addMajorClass = res.data
      }
    },
    // 下载模板
    async downloadMuban() {
      let res = await downloadFile('2022-05-06_f4d76ef7f3644a6fa21d7cb40807e75a.xlsx')
      const href = URL.createObjectURL(
        new Blob([res], {
          type: 'application/octet-stream',
        })
      )
      // 下载文件
      const link = document.createElement('a')
      link.download = '学生导入模板.xlsx'
      link.href = href
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href) //释放url
      document.body.removeChild(link) //释放标签
      this.$Message.success('下载成功!')
    },
    // 导入导出
    async exp() {
      let res = await userExport(this.queryInfo.roleId)
      if (res.type == 'application/json') {
        this.$Message.warning('部分用户出现无角色，请联系管理员')
        //this.tokenLost()
      } else {
        const href = URL.createObjectURL(
          new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
        )
        // 导出excel
        const link = document.createElement('a')
        link.download = '学生表格.xlsx'
        link.href = href
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href) //释放url
        document.body.removeChild(link) //释放标签
        this.$Message.success('导出成功!')
      }
    },
    // 导入成功
    handleExcelImportSuccess(res) {
      console.log(res)
      if (res.code) {
        if (res.code == '1001' || res.code == '1002') {
          this.tokenLost()
        } else {
          this.dialogVisibleImport = true
          this.importError = res.message
        }
      } else {
        this.$Message.success('导入成功')
        this.getData()
      }
    },
    // 删除学生按钮
    async delBtn() {
      if (this.ids.length == 0) {
        // 未勾选
        this.delPoppover = true
        setTimeout(() => {
          this.delPoppover = false
        }, 1000)
      } else {
        this.dialogVisibleDel = true
      }
    },
    // 删除学生请求
    async del() {
      // 删除学生
      let res = await delStudent(this.ids)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.getData()
        this.dialogVisibleDel = false
      }
    },
    // 选择多条
    handleSelectionChange(val) {
      if (val.length > 0) {
        let data = []
        val.forEach((item) => {
          data.push(item.id)
        })
        this.ids = data
        data = []
      } else {
        // 清空
        this.ids = []
      }
    },
    // 提交表单  包含编辑和新增
    submitForm(val) {
      if (val == 'newStudent') {
        // 新增学生
        this.$refs[val].validate(async (valid) => {
          if (valid) {
            this.newStudent['roleId'] = 5
            let res = await addStudent(this.newStudent)
            if (res.code == '') {
              this.$Message.success(res.message)
              this.centerDialogVisibleAdd = false
              this.getData()
              this.newStudent = {}
              this.$refs['newStudent'].resetFields()
            }
          } else {
            return false
          }
        })
      } else {
        // 编辑学生
        this.$refs[val].validate(async (valid) => {
          if (valid) {
            let res = await changeUserInfo(this.editStudent)
            if (res.code == '') {
              // 修改成功
              this.$Message.success(res.message)
              this.centerDialogVisibleEdit = false
            }
          } else {
            return false
          }
        })
      }
    },
    // 筛选专业
    filterChange(obj) {
      console.log(obj)
      if (obj.filterTag.length == 0) {
        // 重置
        this.queryInfo.majors = []
        this.majorData = []
        this.getData()
        this.queryInfo.majors = []
      } else {
        // 筛选
        obj.filterTag.forEach((item) => {
          this.queryInfo.majors.push(item)
        })
        this.getData()
        this.queryInfo.majors = []
      }
    },
    // 查询单条
    find() {
      if (isNaN(this.query)) {
        // 查询名字
        this.queryInfo.nickName = this.query.trim()
        this.getData()
      } else {
        // 查询学号
        this.queryInfo.userAccount = this.query.trim()
        this.getData()
      }
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.nickName = ''
      this.queryInfo.userAccount = ''
      this.getData()
    },
    // 手动删除search
    blurSearch() {
      if (this.query == '') {
        this.clearSearch()
      }
    },
    // 点击编辑行
    async handleClick(row) {
      this.editStudent = row
      // 请求年级 学院

      // 获取当前专业年级
      this.majorData.forEach((item) => {
        if (row.major == item.text) {
          this.editStudentId = item.id
        }
      })
      let res = await getAllGrade(this.editStudentId)
      let resDep = await getAllDept()
      if (res.code == '' && resDep.code == '') {
        // 获取年级后渲染到表单里
        this.allGrade = res.data
        // 获取全部学院渲染到表单里
        this.allDepartment = resDep.data
        resDep.data.forEach((item) => {
          if (this.editStudent.department == item.organizationName) {
            this.getSomeMajors(item.id)
            this.currentDept = item.id
          }
        })
        console.log(row)
        for (let i in this.majorData) {
          if (this.majorData[i].text == row.major) {
            this.addStudentGetMj(this.majorData[i].id)
          }
        }
        setTimeout(() => {
          for (let i in this.addMajorData) {
            if (this.addMajorData[i].organizationName == row.grade) {
              this.addStudentGetMjClass(this.addMajorData[i].id)
            }
          }
        }, 800)
        this.centerDialogVisibleEdit = true
        // 123
      }
    },
    // 获取某学院下的专业
    async getSomeMajors(id) {
      let res = await getMajorsByDet(id)
      if (res.code == '') {
        // 请求成功赋值专业
        this.SomeMajors = res.data
        if (this.currentDept != id) {
          this.editStudent.major = ''
        }
      }
    },
    // 编辑学生时，切换专业重新获取年级
    async updatedGrade(id) {
      let res = await getAllGrade(id)
      if (res.code == '') {
        this.allGrade = res.data
      }
    },
    // 获取数据接口
    async getData() {
      this.majorData = []
      let res = await getAll(this.queryInfo)
      let resMyDept = await getStudentMajors()
      if (res.code == '' && resMyDept.code == '') {
        this.tableData = res.data.records
        this.total = res.data.total
        if (res.data.records.length != 0) {
          // 赋值新增学生学院
          this.newStudent.department = res.data.records[0].department
        }
        resMyDept.data.forEach((item) => {
          this.majorData.push({
            text: item.organizationName,
            value: item.organizationName,
            id: item.id,
          })
        })
      }
    },
    // 修改每条页多少条
    handleSizeChange(num) {
      this.queryInfo.pageSize = num
      this.getData()
    },
    // 修改当前页
    handleCurrentChange(num) {
      this.queryInfo.pageNum = num
      this.getData()
    },
  },
}
</script>

<style scoped>
/deep/.el-card__body {
  padding: 0 20px 10px 20px;
}

.uploadContent {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>