<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索学号或者名字"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 350px"
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
        >添加用户</el-button
      >
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
          <el-form-item label="年级" prop="grade">
            <el-input v-model="newStudent.grade"></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="department">
            <el-input v-model="newStudent.department"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="newStudent.major"></el-input>
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
          >批量删除</el-button
        >
      </el-popover>
      <el-dialog title="警告" :visible.sync="dialogVisibleDel" width="30%">
        <span>你确定要删除勾选的学生吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导入导出 -->
      <el-upload
        action="http://113.78.194.215:9568/user/import"
        style="display: inline-block"
        class="ml-5"
        :show-file-list="false"
        :accept="'xlsx'"
        :on-success="handleExcelImportSuccess"
      >
        <el-button type="primary" style="margin: 20px 0 0 20px; width: 98px"
          >导入 <i class="el-icon-top"></i
        ></el-button>
      </el-upload>
      <el-button
        type="primary"
        @click="exp"
        class="ml-5"
        style="margin: 20px 0 0 20px; width: 98px"
        width="200"
        >导出 <i class="el-icon-bottom"></i
      ></el-button>
      <!-- 表格 -->
      <el-table
        :data="tableData"
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
        >
        </el-table-column>
        <el-table-column prop="nickName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
        </el-table-column>
        <el-table-column prop="department" label="学院" align="center">
        </el-table-column>
        <el-table-column
          align="center"
          prop="grade"
          label="年级"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          align="center"
          :filters="majorData"
          column-key="filterTag"
        >
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)"
              >编辑信息</el-button
            >
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
          <el-form-item label="年级" prop="grade">
            <el-select
              v-model="editStudent.grade"
              placeholder="请选择年级"
              style="width: 325px"
            >
              <el-option
                v-for="item in allGrade"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="department">
            <el-select
              v-model="editStudent.department"
              placeholder="请选择学院"
              style="width: 325px"
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
          <el-form-item label="专业" prop="major">
            <el-select
              v-model="editStudent.major"
              placeholder="请选择专业"
              style="width: 325px"
            >
              <el-option
                v-for="item in SomeMajors"
                :key="item.id"
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
import { getAll, addStudent, delStudent, userExport, getAllGrade, getAllDept, getMajorsByDet, changeUserInfo } from '../api'
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
        phone: [
          {
            required: true,
            validator: validatorPhone,
            trigger: ['blur', 'change'],
          },
        ],
        email: [
          {
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
        major: [
          {
            required: true,
            message: '专业不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        department: [
          {
            required: true,
            message: '学院不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        nickName: [
          {
            required: true,
            message: '名字不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        userAccount: [
          {
            required: true,
            message: '学号不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        sex: [
          {
            required: true,
            message: '性别不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        grade: [
          {
            required: true,
            message: '年级不能为空',
            trigger: ['blur', 'change'],
          },
        ],
      },
      // 增加学生弹窗
      centerDialogVisibleAdd: false,
      // 编辑学生弹窗
      centerDialogVisibleEdit: false,
      // 删除学生
      dialogVisibleDel: false,
      delPoppover: false,
      // 专业筛选
      majorData: [
        { text: '软件工程', value: '软件工程' },
        { text: '数字媒体技术', value: '数字媒体技术' },
        { text: '计算机科学与技术', value: '计算机科学与技术' },
      ],
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
        major: [],
        nickName: '',
        // 当前页
        pageNum: 1,
        // 一页展示多少条
        pageSize: 10,
        userAccount: '',
      },
    }
  },
  watch: {
    'queryInfo.query'(newValue, oldValue) {
      console.log(newValue, oldValue)
    },
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  methods: {
    // 处理token过期
    tokenLost() {
      this.$Message.error('您的登录信息已过期,请重新登录')
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      this.$router.push('/login')
    },
    // 导入导出
    async exp() {
      try {
        let res = await userExport(this.queryInfo.roleId)
        if (res.type == 'application/json') {
          this.tokenLost()
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
      } catch (error) {
        this.$Message.error(error)
      }
    },
    handleExcelImportSuccess() {
      this.$message.success('导入成功')
      this.getData()
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
      if (res.code) {
        // token过期
        if (res.code == '1001' || res.code == '1002') {
          this.tokenLost()
        } else {
          this.$Message.error(res.message)
        }
      } else {
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
            if (res.code) {
              // token过期
              if (res.code == '1001' || res.code == '1002') {
                this.tokenLost()
              } else {
                this.$Message.error(res.message)
              }
            } else {
              this.$Message.success(res.message)
              this.centerDialogVisibleAdd = false
              this.getData()
            }
          } else {
            return false
          }
        })
      } else {
        // 编辑学生
        this.$refs[val].validate(async (valid) => {
          if (valid) {
            try {
              let res = await changeUserInfo(this.editStudent)
              if (res.code) {
                // token过期
                if (res.code == '1001' || res.code == '1002') {
                  this.tokenLost()
                } else {
                  this.$Message.error(res.message)
                }
              } else {
                // 修改成功
                this.$Message.success(res.message)
                this.centerDialogVisibleEdit = false
                this.getData()
              }
            } catch (error) {
              this.$Message.error(res.error)
            }
          } else {
            return false
          }
        })
      }
    },
    // 筛选专业
    filterChange(obj) {
      this.queryInfo.major = obj.filterTag
      this.getData()
    },
    // 查询单条
    find() {
      if (isNaN(this.query)) {
        this.queryInfo.nickName = this.query.trim()
        this.getData()
      } else {
        this.queryInfo.userAccount = this.query.trim()
        this.getData()
      }
      this.queryInfo.nickName = ''
      this.queryInfo.userAccount = ''
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.nickName = ''
      this.queryInfo.userAccount = ''
      this.getData()
    },
    // 点击编辑行
    async handleClick(row) {
      this.editStudent = row
      // 请求年级 学院
      try {
        let res = await getAllGrade()
        let resDep = await getAllDept()
        if (res.code && resDep.code) {
          // token过期
          if (res.code == '1001' || res.code == '1002' || resDep.code == '1001' || resDep.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
            this.$Message.error(resDep.message)
          }
        } else {
          // 获取年级后渲染到表单里
          this.allGrade = res.data
          // 获取全部学院渲染到表单里
          this.allDepartment = resDep.data
          resDep.data.forEach(item => {
            if (this.editStudent.department == item.organizationName) {
              this.getSomeMajors(item.id)
              this.currentDept = item.id
            }
          })
          this.centerDialogVisibleEdit = true
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },
    // 获取某学院下的专业
    async getSomeMajors(id) {
      try {
        let res = await getMajorsByDet(id)
        if (res.code) {
          // token过期
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          // 请求成功赋值专业
          this.SomeMajors = res.data
          if (this.currentDept != id) {
            this.editStudent.major = ''
          }
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },
    // 获取数据接口
    async getData() {
      try {
        let res = await getAll(this.queryInfo)
        if (res.code) {
          // token过期
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      } catch (error) {
        this.$Message.error(error)
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

<style></style>
