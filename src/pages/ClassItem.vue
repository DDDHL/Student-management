<template>
  <div style="margin: -10px 0">
    <el-card>
      <div class="title">{{ name }}</div>
      <div class="title1">{{ teacherName }}</div>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索学生"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 350px; margin-right: 20px"
        @blur="blurSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>
      <!-- 新增学生 -->
      <el-button
        type="primary"
        style="margin-top: 20px"
        @click="dialogVisible = true"
        >新增学生 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的学生"
        v-model="delVisible"
      >
        <el-button
          type="danger"
          style="margin: 20px 0 0 20px"
          slot="reference"
          @click="delStudentCheck"
          >批量删除<i class="el-icon-remove-outline"></i>
        </el-button>
      </el-popover>
      <el-dialog title="警告" :visible.sync="dialogVisibleDel" width="30%">
        <span>你确定要删除勾选的学生吗?</span>
        <span slot="footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="delStudent">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改课程信息 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="dialogVisibleEdit = true"
        v-if="changInfoBtn"
        >修改课程信息 <i class="el-icon-edit"></i
      ></el-button>

      <!-- 修改上课时间 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="dialogVisibleEditTime = true"
        v-if="changClassTimeBtn"
        >修改上课时间 <i class="el-icon-edit-outline"></i
      ></el-button>
      <!-- 导入导出 -->
      <el-upload
        :action="this.$store.state.allip + '/curriculum-user/import'"
        style="display: inline-block"
        class="ml-5"
        :show-file-list="false"
        :accept="'xlsx'"
        :on-success="handleExcelImportSuccess"
        :headers="upLoadHeader"
        :data="uploadData"
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
      <!-- 新增学生表单 -->
      <el-dialog
        title="新增学生"
        :visible.sync="dialogVisible"
        width="40%"
        center
      >
        <el-table :data="addTable" style="width: 100%">
          <el-table-column prop="userAccount" label="学号" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="handleDelTable(scope.row)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template></el-table-column
          >
        </el-table>
        <el-input placeholder="请输入内容" v-model="inputAccount">
          <el-button
            slot="append"
            icon="el-icon-plus"
            @click="addInput"
          ></el-button>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addStudent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改课程信息表单 -->
      <el-dialog
        title="修改课程信息"
        :visible.sync="dialogVisibleEdit"
        width="500px"
        center
      >
        <div class="changeClassInfo">
          <div>课程名字：</div>
          <div style="width: 300px; margin-left: -70px">
            <el-input v-model="className" placeholder="修改课程名字"></el-input>
          </div>
        </div>
        <div class="changeClassInfo" style="margin-top: 20px">
          <div>课程信息：</div>
          <div style="width: 300px; margin-left: -70px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="修改课程信息(非必填)"
              v-model="classInfo"
              maxlength="120"
              show-word-limit
            >
            </el-input>
          </div>
        </div>
        <span slot="footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="changeInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改上课时间表单 -->
      <el-drawer
        title="修改上课时间"
        :visible.sync="dialogVisibleEditTime"
        :direction="direction"
        :before-close="CloseTime"
      >
        <div>
          <el-table :data="changeTimeTable" style="width: 100%">
            <el-table-column prop="weeks" label="上课周" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="上课星期" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.weeksNumber"
                  placeholder="请选择上课的星期 (可多选)"
                  multiple
                >
                  <el-option
                    v-for="item in allWeekDays"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="上课时间" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.weeksTime"
                  placeholder="开始上课时间 (仅第一节)"
                  multiple
                >
                  <el-option
                    v-for="item in allClassTime"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.value }}</span
                    >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="delDesign(scope.row.weeks)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width: 80%; margin-left: 10%">
          <el-input placeholder="添加新的周" v-model="addChangeTime">
            <el-button
              slot="append"
              icon="el-icon-plus"
              @click="addNewChangeTime"
            ></el-button>
          </el-input>
        </div>
        <div style="margin-top: 20px; text-align: center">
          <el-button type="primary" @click="saveChange">保存修改</el-button>
          <el-button type="warning" @click="cancelChange">取消修改</el-button>
        </div>
      </el-drawer>

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
        <el-table-column fixed type="selection" align="center" />
        <el-table-column
          prop="department"
          label="学院"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="major"
          label="专业"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="grade"
          label="年级"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="majorClass"
          label="班级"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="userAccount"
          label="学号"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="nickName"
          label="姓名"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          :resizable="false"
        />
      </el-table>
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
import { getClassStudents, delClassStudent, addSomeStudent, editClassTime, getClass, editClassInfo, getClassInfo } from '../api'
export default {
  name: 'ClassItem',
  data() {
    return {
      // 搜索参数
      query: '',
      // 请求参数
      queryInfo: {
        curriculumId: 1,
        pageNum: 1,
        pageSize: 10
      },
      // 表格总数
      total: 0,
      // 表格数据
      tableData: [],
      // 删除的id
      delStudentId: [],
      delVisible: false,
      dialogVisibleDel: false,
      // 新增学生
      dialogVisible: false,
      addTable: [],
      inputAccount: '',
      // 修改课程信息
      dialogVisibleEdit: false,
      // 修改课程时间
      dialogVisibleEditTime: false,
      name: '',
      teacherName: '暂定',
      direction: 'rtl',
      changeTimeTable: [],
      allWeekDays: [],
      allClassTime: [],
      addChangeTime: '',
      // 获取新时间规则
      timeQuery: {
        curriculumDepartment: 0,
        curriculumGarde: 0,
        curriculumMajor: 0,
        curriculumName: "",
        pageNum: 1,
        pageSize: 10
      },
      // 文件上传token
      upLoadHeader: {},
      dialogVisibleImport: false,
      importError: '',
      uploadData: {},
      // 修改课程信息
      className: '',
      classInfo: '',
      changInfoBtn: false,
      changClassTimeBtn: false,
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getClassBySchool(this.$route.query.id)
      return
    }
    this.changInfoBtn = true
    this.changClassTimeBtn = true
    this.initData()
    // 文件上传token
    this.upLoadHeader = { token: JSON.parse(localStorage.getItem('user')).token }
    this.uploadData = { curriculumId: this.queryInfo.curriculumId }
  },
  methods: {
    // 获取学校跳转班级
    async getClassBySchool(id) {
      let res = await getClassInfo(id)
      if (res.code == '') {
        this.teacherName = '辅导员 : ' + res.data.counselor.nickName
        this.name = res.data.className
        this.tableData = res.data.students
      }
    },
    // 导入成功
    handleExcelImportSuccess(res) {
      console.log(res);
      if (res.code) {
        if (res.code == '1001' || res.code == '1002') {
          this.$Message.error('您的登录信息已过期,请重新登录')
          localStorage.removeItem('user')
          localStorage.removeItem('menus')
          this.$router.push('/login')
        } else {
          this.dialogVisibleImport = true
          this.importError = res.message
        }
      } else {
        this.$Message.success('导入成功')
        this.getData()
      }
    },
    // 获取数据
    async getData() {
      let res = await getClassStudents(this.queryInfo)
      if (res.code == '') {
        this.tableData = res.data.records
      }
    },
    // 初始化数据
    async initData() {
      // 设置查询课程的id
      this.className = this.name = this.$store.state.classInfo.curriculumName
      //this.teacherName = this.$store.state.classInfo.curricu
      this.queryInfo.curriculumId = this.$store.state.curriculumId
      this.classInfo = this.$store.state.curriculumInfo
      // 初始化时间选择
      this.allWeekDays = this.$store.state.allWeekDays
      this.allClassTime = this.$store.state.allClassTime
      if (this.queryInfo.curriculumId == 0) {
        this.$Message.error('请在班级管理页面重新进入');
        //this.$router.push('/class')
        return
      }
      this.getData()
      this.changeTimeTable = []
      let data = this.$store.state.classInfo.param
      for (let i = 0; i < data.weeks.length; i++) {
        let a = data.weeksNumber[i].split('、')
        let b = data.weeksTime[i].split(',')
        this.changeTimeTable.push({ weeks: data.weeks[i], weeksNumber: a, weeksTime: b })
      }
    },
    // 获取最新班级信息
    async updateClassInfo() {
      let req = await getClass(this.timeQuery)
      if (req.code == '') {
        this.$store.state.classInfo = req.data.records[0]
        this.initData()
      }
    },
    // 新增学生(表单)
    async addStudent() {
      let account = []
      this.addTable.forEach(item => {
        account.push(item.userAccount)
      })
      let res = await addSomeStudent(this.queryInfo.curriculumId, account)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.getData()
        this.addTable = []
        this.dialogVisible = false
      }
    },
    // 新增学生表单删除单条
    handleDelTable(e) {
      let index = this.addTable.indexOf(this.addTable.filter(d => d.userAccount == e.userAccount)[0])
      this.addTable.splice(index, 1)
    },
    // 新增学生表单添加单条
    addInput() {
      if (this.inputAccount == '') {
        this.$Message.error('请输入学号 !')
        return
      }
      this.addTable.push({ userAccount: this.inputAccount })
      this.inputAccount = ''
    },
    // 修改课程信息
    async changeInfo() {
      if (this.className == '') {
        this.$Message.error('请填写课程名字')
        return
      }
      let data = {
        curriculumDepartment: 0,
        curriculumGarde: 0,
        curriculumInfo: this.classInfo,
        curriculumMajor: 0,
        curriculumName: this.className,
        id: this.queryInfo.curriculumId
      }
      let res = await editClassInfo(data)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.dialogVisibleEdit = false
        this.updateClassInfo()
      }
    },
    // 删除某周
    delDesign(e) {
      let index = this.changeTimeTable.indexOf(this.changeTimeTable.filter(d => d.weeks == e)[0])
      this.changeTimeTable.splice(index, 1)
    },
    // 新增某周
    addNewChangeTime() {
      if (this.addChangeTime == '') {
        this.$Message.error('请输入第几周')
        return
      }
      let index = this.changeTimeTable.indexOf(this.changeTimeTable.filter(d => d.weeks == this.addChangeTime)[0])
      if (index == -1) {
        this.changeTimeTable.push({ weeks: this.addChangeTime, weeksNumber: this.changeTimeTable[0].weeksNumber, weeksTime: this.changeTimeTable[0].weeksTime })
        this.changeTimeTable.sort((a, b) => a.weeks - b.weeks)
        this.addChangeTime = ''
      } else {
        this.$Message.error('已有这一周 !')
      }
    },
    // 保存改变的时间
    async saveChange() {
      this.addChangeTime = ''
      let a = []
      let b = []
      let c = []
      let number = ''
      let weeks = ''
      let id = this.queryInfo.curriculumId
      this.changeTimeTable.forEach(item => {
        for (let i = 0; i < item.weeksNumber.length; i++) {
          if (i == item.weeksNumber.length - 1) {
            number += item.weeksNumber[i]
          } else {
            number = number + item.weeksNumber[i] + '、'
          }
        }
        for (let j = 0; j < item.weeksTime.length; j++) {
          if (j == item.weeksTime.length - 1) {
            weeks += item.weeksTime[j]
          } else {
            weeks = weeks + item.weeksTime[j] + ','
          }
        }
        a.push(item.weeks)
        b.push(number)
        c.push(weeks)
        weeks = number = ''
      }
      )
      let res = await editClassTime(id, a, b, c)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.dialogVisibleEditTime = false
        this.timeQuery.curriculumName = this.name
        this.updateClassInfo()
      }
    },
    // 取消修改
    cancelChange() {
      this.addChangeTime = ''
      this.initData()
      this.dialogVisibleEditTime = false
    },
    // 关闭修改时间
    CloseTime(done) {
      this.$confirm('确认关闭？ 将取消修改!')
        .then(() => {
          this.dialogVisibleEditTime = false
          done();
        })
        .catch(() => { });
    },

    // 查询单条
    find() {
      this.queryInfo.roleName = this.query.trim()
      this.getData()
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.roleName = ''
      this.getData()
    },
    // 手动删除search
    blurSearch() {
      if (this.query == '') {
        this.clearSearch()
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
    // 批量删除
    handleSelectionChange(e) {
      this.delStudentId = []
      e.forEach(item => {
        this.delStudentId.push(item.userAccount)
      })
    },
    // 删除学生检测
    delStudentCheck() {
      if (this.delStudentId.length == 0) {
        this.delVisible = true
        setTimeout(() => {
          this.delVisible = false
        }, 1000)
      } else {
        this.dialogVisibleDel = true
      }
    },
    // 删除学生
    async delStudent() {
      let res = await delClassStudent(this.queryInfo.curriculumId, this.delStudentId)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.getData()
        this.dialogVisibleDel = false
      }
    }
  }
}
</script>

<style>
.title {
  font-size: 25px;
  font-weight: 700;
  text-align: center;
}
.title1 {
  text-align: center;
  margin-top: 5px;
}
.changeClassInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
