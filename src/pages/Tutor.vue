<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索工号或者名字"
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
        >添加导员<i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 添加导员弹窗 -->
      <el-dialog
        title="添加导员"
        :visible.sync="centerDialogVisibleAdd"
        width="430px"
        center
      >
        <!-- 添加导员表单 -->
        <el-form
          :model="newStudent"
          label-width="65px"
          ref="newStudent"
          :rules="rules"
          style="margin-left: -10px"
        >
          <el-form-item label="工号" prop="userAccount">
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
          <el-form-item label="专业" required>
            <el-select
              multiple
              placeholder="请选择专业"
              style="width: 325px"
              v-model="allNewMajor"
              @change="addNewMajor"
            >
              <el-option
                v-for="item in majorData"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="年级"
            required
            v-for="(val, key) in addGradeTable"
            :key="key"
          >
            <el-select
              :placeholder="'请选择' + val[0].majorName + '的年级'"
              style="width: 325px"
              v-model="newGrade[`${key}`]"
              @change="chooseGrade"
            >
              <el-option
                v-for="item in val"
                :key="item.name"
                :label="item.name + item.majorName"
                :value="item.id"
              >
              </el-option>
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

      <!-- 删除导员 -->
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的导员"
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
        <span>你确定要删除勾选的导员吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导入导出 -->
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
        <el-button type="primary" style="margin: 20px 0 0 20px; width: 98px"
          >导入 <i class="el-icon-top"></i
        ></el-button>
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
      <!-- 导出 -->
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
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" align="center">
        </el-table-column>

        <el-table-column
          prop="userAccount"
          label="工号"
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
          prop="major"
          label="专业"
          align="center"
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
              >编辑信息<i class="el-icon-edit"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑导员弹窗 -->
      <el-dialog
        title="编辑导员信息"
        :visible.sync="centerDialogVisibleEdit"
        width="430px"
        center
      >
        <!-- 编辑导员表单 -->
        <el-form
          :model="editStudent"
          label-width="65px"
          ref="editStudent"
          :rules="rules"
          style="margin-left: -10px"
        >
          <el-form-item label="工号" prop="userAccount">
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
          <el-form-item label="学院" prop="department">
            <el-input v-model="editStudent.department" disabled></el-input>
          </el-form-item>
          <el-form-item label="专业" required>
            <el-input v-model="editStudent.major" disabled></el-input>
          </el-form-item>
          <div class="changeEditMajor">
            <el-button type="text" @click="drawer = true"
              >修改绑定的专业</el-button
            >
          </div>
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
      <el-drawer
        title="修改绑定的专业"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
      >
        <div class="editMajor">
          <el-form
            :model="newStudent"
            label-width="65px"
            ref="newStudent"
            :rules="rules"
            style="margin-left: -10px"
          >
            <el-form-item label="专业" required>
              <el-select
                multiple
                placeholder="请选择专业"
                style="width: 300px"
                v-model="allNewMajor"
                @change="addNewMajor"
              >
                <el-option
                  v-for="item in majorData"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-for="(val, key) in addGradeTable"
              label="年级"
              required
              :key="key"
            >
              <el-select
                :placeholder="'请选择' + val[0].majorName + '的年级'"
                style="width: 300px"
                v-model="newGrade[`${key}`]"
                @change="chooseGrade"
              >
                <el-option
                  v-for="item in val"
                  :key="item.name"
                  :label="item.name + item.majorName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="editMajor">
          <el-button type="primary" @click="saveEdit">保存修改</el-button>
          <el-button type="warning" @click="cancelEdit">取消修改</el-button>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
/* 获取导员列表接口 */
import { getAll, addStudent, delStudent, userExport, getAllGrade, getMajorsByDet, changeUserInfo, getStudentMajors, editTutorMajor } from '../api'
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
            message: '工号不能为空',
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
      // 导入失败文字
      importError: '',
      // 导入失败弹窗
      dialogVisibleImport: false,
      // 增加导员弹窗
      centerDialogVisibleAdd: false,
      // 编辑导员弹窗
      centerDialogVisibleEdit: false,
      // 删除导员
      dialogVisibleDel: false,
      delPoppover: false,
      // 专业筛选
      majorData: [],
      // 文件上传数据
      upLoadData: { roleId: 3 },
      // 文件上传token
      upLoadHeader: {},
      // 编辑导员的学院
      currentDept: 0,
      // 某学院专业
      SomeMajors: [],
      // 全部学院
      allDepartment: [],
      // 全部年级
      allGrade: [],
      // 勾选的导员
      ids: [],
      // 表格数据
      total: 0,
      // 新增导员年级
      addMajorData: [],
      // 新增导员
      newStudent: {},
      // 编辑导员
      editStudent: {},
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        roleId: 3,
        majors: [],
        nickName: '',
        // 当前页
        pageNum: 1,
        // 一页展示多少条
        pageSize: 10,
        userAccount: '',
      },
      // 多选专业
      allNewMajor: [],
      addGradeTable: {},
      allGradeInMajor: {},
      newGrade: {},
      // 记录当前选择的年级key
      allGradeKey: [],
      // 抽屉
      drawer: false,
      direction: 'rtl',
      userId: 0,
    }
  },
  watch: {
    'queryInfo.query'(newValue, oldValue) {
      console.log(newValue, oldValue)
    },
    'centerDialogVisibleEdit'(newValue) {
      if (!newValue) {
        // 关闭编辑就重新获取表格
        this.getData()
      }
    }
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  mounted() {
    // 获取token
    let Mytoken = JSON.parse(localStorage.getItem('user')).token
    this.upLoadHeader = { token: Mytoken }
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
        link.download = '导员表格.xlsx'
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
      console.log(res);
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
    // 删除导员按钮
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
    // 删除导员请求
    async del() {
      // 删除导员
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
        // 新增导员
        this.$refs[val].validate(async (valid) => {
          if (valid) {
            this.newStudent['roleId'] = 3
            this.newStudent.majorIds = []
            this.allGradeKey.forEach(i => {
              this.newStudent.majorIds.push(this.newGrade[i])
            })
            console.log(this.newStudent)
            let res = await addStudent(this.newStudent)
            if (res.code == '') {
              this.$Message.success(res.message)
              this.centerDialogVisibleAdd = false
              this.getData()
            }
          } else {
            return false
          }
        })
      } else {
        // 编辑导员
        this.$refs[val].validate(async (valid) => {
          if (valid) {
            this.editStudent.major = ''
            console.log(this.editStudent)
            let res = await changeUserInfo(this.editStudent)
            if (res.code == '') {
              console.log(res)
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
    // 查询单条
    find() {
      if (isNaN(this.query)) {
        // 查询名字
        this.queryInfo.nickName = this.query.trim()
        this.getData()
      } else {
        // 查询工号
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
      this.userId = row.id
      /*  // 请求年级 学院
       let res = await getAllGrade('')
       let resDep = await getAllDept()
       if (res.code == '' && resDep.code == '') {
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
       } */
      this.centerDialogVisibleEdit = true
    },
    // 取消编辑专业
    cancelEdit() {
      this.addGradeTable = {}
      this.allGradeKey = []
      this.drawer = false
      this.newGrade = {}
      this.allNewMajor = []
    },
    // 保存编辑专业
    async saveEdit() {
      let key = []
      if (this.allGradeKey.length == 0) {
        this.$Message.error('请先选择好绑定的专业再提交')
        return
      }
      this.allGradeKey.forEach(i => {
        if (this.newGrade[i] != undefined) {
          key.push(this.newGrade[i])
        }
      })
      if (key.length == 0) {
        this.$Message.error('请先选择好绑定的年级再提交')
        return
      }
      let res = await editTutorMajor({ userId: this.userId, organizationIds: key })
      if (res.code == '') {
        this.$Message.success(res.message)
        this.cancelEdit()
        this.centerDialogVisibleEdit = false
      }
    },
    // 编辑绑定专业
    handleClose(done) {
      this.$confirm('确认关闭？将取消修改')
        .then(() => {
          this.cancelEdit()
          done();
        })
        .catch(() => { });
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
        resMyDept.data.forEach(item => {
          this.majorData.push({ text: item.organizationName, value: item.id + ',' + item.organizationName })
        })
      }
    },
    // 新增导员选择专业
    addNewMajor(e) {
      this.addGradeTable = {}
      this.allGradeKey = []
      this.newGrade = {}
      e.forEach(async item => {
        let res = await getAllGrade(item.split(',')[0])
        let gradeTable = []
        if (res.code == '') {
          res.data.forEach(i => {
            gradeTable.push({ id: i.id, name: i.organizationName, majorName: item.split(',')[1], value: '' })
          })
        }
        this.allGradeKey.push(item.split(',')[0])
        this.$set(this.addGradeTable, item.split(',')[0], gradeTable);
      })
    },
    // 选择新年级
    chooseGrade() {
      console.log(this.newGrade)
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
.changeEditMajor {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-top: -20px;
}
.editMajor {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
