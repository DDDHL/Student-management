<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索班级名字"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 400px; margin-right: 20px"
        @blur="blurSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>
      <!-- 新增班级 -->
      <el-button type="primary" @click="dialogVisible = true"
        >新增班级 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <el-dialog
        title="新增班级"
        :visible.sync="dialogVisible"
        width="800px"
        center
      >
        <div class="addFather">
          <div class="addTitle">教师名字</div>
          <div class="addInput">
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="addQuerys.curriculumTeacher"
              disabled
            >
            </el-input>
          </div>
          <div class="addTitle">上课时间</div>
          <div class="addInput">
            <el-select
              v-model="startClassTime"
              placeholder="开始上课时间 (可多选)"
              multiple
            >
              <el-option
                v-for="item in allClassTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="addFather">
          <div class="addTitle">开始周</div>
          <div class="addInput">
            <el-select v-model="startWeek" placeholder="请选择开始周">
              <el-option
                v-for="item in allWeek"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="addTitle">结课周</div>
          <div class="addInput">
            <el-select v-model="endWeek" placeholder="请选择结课周">
              <el-option
                v-for="item in allWeek"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="info">
          <div class="infoText">上课星期</div>
          <div>
            <el-select
              v-model="weekDays"
              placeholder="请选择上课的星期 (可多选)"
              multiple
              style="width: 536px"
            >
              <el-option
                v-for="item in allWeekDays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div style="text-align: center">
          <el-button type="text" @click="openDesign"
            >详细设计上课时间 (设置跨周、变化上课时间等)</el-button
          >
        </div>
        <div class="info">
          <div class="infoText">课程描述</div>
          <div style="width: 536px">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="addQuerys.curriculumInfo"
              maxlength="120"
              show-word-limit
            >
            </el-input>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="newClass">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 表格 -->
      <el-table
        @row-click="rowClick"
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="allLog"
        border
        stripe
        row-key="id"
      >
        <el-table-column
          prop="curriculumName"
          label="班级名字"
          align="center"
        />
        <el-table-column
          prop="curriculumTeacher"
          label="任课老师"
          align="center"
        />
        <el-table-column prop="studentCount" label="班级人数" align="center" />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          fixed="right"
        />
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getLogData.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="getLogData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getClass, addClass } from '../api'
export default {
  name: 'Class',
  data() {
    return {
      dialogVisible: false,
      // 分页总数
      total: 0,
      // 搜索数
      query: '',
      // 全部数据
      allLog: [],
      // 请求参数
      getLogData: {
        curriculumDepartment: 0,
        curriculumGarde: 0,
        curriculumMajor: 0,
        curriculumName: "",
        pageNum: 1,
        pageSize: 10
      },
      tatol: 0,
      addQuerys: {
        curriculumDepartment: 0,
        curriculumGarde: 0,
        curriculumInfo: "",
        curriculumMajor: 0,
        curriculumName: "",
        curriculumTeacher: "",
        weeks: [],
        weeksNumber: [],
        weeksTime: []
      },
      allWeek: [],
      allClassTime: [],
      startWeek: 1,
      endWeek: 20,
      startClassTime: [],
      weekDays: [],
      allWeekDays: []
    }
  },
  created() {
    this.getData()
    this.initData()
  },
  methods: {
    // 处理token过期
    tokenLost() {
      this.$Message.error('您的登录信息已过期,请重新登录')
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      this.$router.push('/login')
    },
    // 初始化新增课程参数
    initData() {
      // 初始化用户姓名
      this.addQuerys.curriculumTeacher = JSON.parse(localStorage.getItem('user')).nickName
      // 初始化上课时间数组
      let classTime = ['08:20', '09:10', '10:10', '11:00', '11:50', '12:40', '13:30', '14:15', '15:05', '16:05', '16:55', '19:00', '19:50', '20:40']
      let tranformNumber = new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']])
      while (this.allWeek.length < 20) {
        this.allWeek.push({ value: this.allWeek.length + 1, label: '第 ' + (parseInt(this.allWeek.length) + 1) + ' 周' })
        if (this.allWeek.length < 15) {
          this.allClassTime.push({ value: classTime[this.allWeek.length - 1], label: '第 ' + [this.allWeek.length] + ' 节' })
        }
        if (this.allWeek.length < 8) {
          this.allWeekDays.push({ value: '星期' + tranformNumber.get(this.allWeek.length), label: '星期' + tranformNumber.get(this.allWeek.length) })
        }
      }
    },
    // 初始化获取数据
    async getData() {
      try {
        let res = await getClass(this.getLogData);
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          console.log(res)
          this.allLog = res.data.records
          this.total = res.data.total
          /* // 赋值完恢复
          this.getLogData.nickName = '' */
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },
    // 点击行
    rowClick(row) {
      console.log(row)
    },
    // 新建班级
    async newClass() {
      try {
        let res = await addClass()
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.$Message.success(res.message)
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },
    // 详细设计上课时间
    openDesign() {
      if (this.weekDays.length == 0 || this.startClassTime.length == 0) {
        this.$Message.warning('请先选择上课时间以及上课星期 !')
      } else {
        console.log('成功')
      }
    },
    // 查询单条
    find() {
      if (isNaN(this.query)) {
        // 查询名字
        this.getLogData.nickName = this.query.trim()
        this.getData()
      } else {
        // 查询学号
        this.getLogData.userAccount = this.query.trim()
        this.getData()
      }
    },
    // 搜索清空还原
    clearSearch() {
      this.getLogData.nickName = ''
      this.getLogData.userAccount = ''
      this.getData()
    },
    // 手动删除search
    blurSearch() {
      if (this.query == '') {
        this.clearSearch()
      }
    },
    // 分页大小
    handleSizeChange(pageSize) {
      this.getLogData.pageSize = pageSize
      if (this.value2) {
        this.getLogData.startTime = this.value2[0]
        this.getLogData.endTime = this.value2[1]
      } else {
        this.getLogData.startTime = ''
        this.getLogData.endTime = ''
      }
      this.getData()
    },
    // 跳转页数
    handleCurrentChange(pageNum) {
      this.getLogData.pageNum = pageNum
      if (this.value2) {
        this.getLogData.startTime = this.value2[0]
        this.getLogData.endTime = this.value2[1]
      } else {
        this.getLogData.startTime = ''
        this.getLogData.endTime = ''
      }
      this.getData()
    },
    // 筛选日期
    // 日期改变
    dateChange() {
      if (this.value2) {
        this.getLogData.startTime = this.value2[0]
        this.getLogData.endTime = this.value2[1]
      } else {
        this.getLogData.startTime = ''
        this.getLogData.endTime = ''
      }
      this.getData()
    },
  },
}
</script>

<style scoped>
/deep/.el-table__row:hover {
  cursor: pointer;
}
.addTitle {
  width: 60px;
  margin: 0 20px 0 0;
}
.addInput {
  width: 217px;
  margin-right: 20px;
}
.addFather {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
.info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.infoText {
  width: 60px;
  margin: 0 20px 0 56px;
}
</style>
