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
      <el-button
        type="primary"
        @click="dialogVisible = true"
        style="margin-top: 20px"
        >新增班级 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <el-button type="danger" @click="delClass" style="margin-top: 20px"
        >删除班级 <i class="el-icon-remove-outline"></i
      ></el-button>
      <!-- 新增班级表单 -->
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
              placeholder="开始上课时间 (仅第一节)"
              multiple
              :disabled="timeDisable"
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
            <el-select
              v-model="startWeek"
              placeholder="请选择开始周"
              :disabled="isDesign"
            >
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
            <el-select
              v-model="endWeek"
              placeholder="请选择结课周"
              :disabled="isDesign"
            >
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
        <div class="info" style="margin-bottom: 20px">
          <div class="infoText">课程名字</div>
          <div style="width: 536px">
            <el-input
              v-model="addQuerys.curriculumName"
              placeholder="请输入课程的名字"
            ></el-input>
          </div>
        </div>
        <div class="info">
          <div class="infoText">上课星期</div>
          <div>
            <el-select
              v-model="weekDays"
              placeholder="上课星期 (可多选)"
              multiple
              style="width: 536px"
              :disabled="timeDisable"
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
              placeholder="请输入内容 (非必填)"
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
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="allLog"
        border
        stripe
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" align="center" />
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
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="rowClick(scope.row)" type="primary" size="small"
              >查看班级</el-button
            >
          </template>
        </el-table-column>
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
    <!-- 课程时间设计页面 -->
    <div>
      <el-drawer
        title="自定义每周上课时间"
        :visible.sync="drawer"
        :before-close="closeDesign"
      >
        <div>
          <el-table :data="designTable" style="width: 100%">
            <el-table-column prop="weeks" label="上课周" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="上课星期" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.weeksNumber"
                  placeholder="请选择上课的星期 (可多选)"
                  multiple
                  :disabled="weeksDisable"
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
        <div
          style="
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          "
        >
          <div style="width: 112px"></div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <el-input-number
            v-model="addWeekNum"
            :min="1"
            :max="20"
          ></el-input-number>
          <el-button type="primary" @click="addWeek">新增第几周</el-button>
          <el-button type="primary" @click="saveDesign">保存自定义</el-button>
          <el-button type="warning" @click="cancelDesign">取消自定义</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { getClass, addClass, delClass } from '../api'
export default {
  name: 'Class',
  data() {
    return {
      weeksDisable: false,
      timeDisable: false,
      drawer: false,
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
      endWeek: 5,
      startClassTime: [],
      weekDays: [],
      allWeekDays: [],
      designTable: [],
      isDesign: false,
      addWeekNum: 1,
      // 删除id
      delClassId: []
    }
  },
  watch: {
    startWeek() {
      if (this.startWeek > this.endWeek) {
        this.$Message.error('开始周必须小于结束周 ! 请先设置结束周')
        this.startWeek = 1
        return
      }
    },
    endWeek() {
      if (this.startWeek > this.endWeek) {
        this.$Message.error('开始周必须大于结束周 ! 请先设置开始周')
        this.endWeek = 5
        return
      }
    }
  },
  created() {
    this.getData()
    this.initData()
  },
  methods: {
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
      let res = await getClass(this.getLogData);
      console.log(res)
      if (res.code == '') {
        this.allLog = res.data.records
        this.total = res.data.total
      }
      /* // 赋值完恢复
      this.getLogData.nickName = '' */
    },
    // 点击查看班级
    rowClick(row) {
      this.$store.state.curriculumId = row.id
      this.$store.state.classInfo = row
      this.$store.state.allClassTime = this.allClassTime
      this.$store.state.allWeekDays = this.allWeekDays
      this.$router.push('/classItem')
    },
    // 新建班级
    async newClass() {
      if (!this.designTable.length) {
        this.selectFinish('非自定义')
      }
      if (!this.startClassTime.length || !this.weekDays.length || this.addQuerys.curriculumName == '') {
        this.$Message.error('请完善表单再提交!')
        return
      }
      let res = await addClass(this.addQuerys)
      console.log(res)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.dialogVisible = false
        this.getData()
      }
    },
    // 提交参数初始化
    queryInit() {
      let weeksTime = ''
      let weeksNumber = ''
      for (let i = this.startWeek; i < this.endWeek + 1; i++) {
        for (let j = 0; j < this.startClassTime.length; j++) {
          if (j == this.startClassTime.length - 1) {
            weeksTime = weeksTime + this.startClassTime[j]
          } else {
            weeksTime = weeksTime + this.startClassTime[j] + ','
          }
        }
        for (let k = 0; k < this.weekDays.length; k++) {
          if (k == this.weekDays.length - 1) {
            weeksNumber = weeksNumber + this.weekDays[k]
          } else {
            weeksNumber = weeksNumber + this.weekDays[k] + '、'
          }
        }
        this.addQuerys.weeks.push(i)
        this.addQuerys.weeksNumber.push(weeksNumber)
        this.addQuerys.weeksTime.push(weeksTime)
        weeksTime = ''
        weeksNumber = ''
      }
    },
    // 详细设计上课时间
    openDesign() {
      if (this.weekDays.length == 0 || this.startClassTime.length == 0) {
        this.$Message.warning('请先选择上课时间以及上课星期 !')
      } else {
        this.isDesign = true
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
          this.drawer = true
        }, 500);
        if (!this.designTable.length) {
          for (var item = this.startWeek; item <= this.endWeek; item++) {
            this.designTable.push({ weeks: item, weeksNumber: this.weekDays, weeksTime: this.startClassTime })
          }
        }
      }
    },
    // 新增周
    addWeek() {
      let res = this.designTable.indexOf(this.designTable.filter(d => d.weeks == this.addWeekNum)[0])
      if (res != -1) {
        this.$Message.error('已经有这一周 !')
      } else {
        this.designTable.splice(this.addWeekNum - 1, 0, { weeks: this.addWeekNum, weeksNumber: this.designTable[0].weeksNumber, weeksTime: this.designTable[0].weeksTime })
        this.designTable.sort((a, b) => { return a.weeks - b.weeks })
      }
    },
    // 删除周
    delDesign(e) {
      let index = this.designTable.indexOf(this.designTable.filter(d => d.weeks == e)[0])
      this.designTable.splice(index, 1)
    },
    // 取消自定义
    cancelDesign() {
      this.isDesign = false
      this.drawer = false
      this.timeDisable = false
      this.weekDays = this.startClassTime = []
      this.designTable = []
    },
    // 保存自定义
    saveDesign() {
      this.selectFinish('自定义')
      this.startWeek = this.designTable[0].weeks
      this.endWeek = this.designTable[this.designTable.length - 1].weeks
      this.drawer = false
      this.timeDisable = true
      this.weekDays = this.startClassTime = ['自定义']
      this.$Message.success('自定义保存成功!')
    },
    // 时间格式化成请求需要参数
    selectFinish(e) {
      this.addQuerys.weeksNumber = []
      this.addQuerys.weeksTime = []
      this.addQuerys.weeks = []
      if (e == '自定义') {
        let weeksNumber = ''
        let weeksTime = ''
        for (let i = 0; i < this.designTable.length; i++) {
          for (let j = 0; j < this.designTable[i].weeksNumber.length; j++) {
            if (j == this.designTable[i].weeksNumber.length - 1) {
              weeksNumber = weeksNumber + this.designTable[i].weeksNumber[j]
            } else {
              weeksNumber = weeksNumber + this.designTable[i].weeksNumber[j] + '、'
            }
          }
          for (let k = 0; k < this.designTable[i].weeksTime.length; k++) {
            if (k == this.designTable[i].weeksTime.length - 1) {
              weeksTime = weeksTime + this.designTable[i].weeksTime[k]
            } else {
              weeksTime = weeksTime + this.designTable[i].weeksTime[k] + ','
            }
          }
          this.addQuerys.weeksNumber.push(weeksNumber)
          this.addQuerys.weeksTime.push(weeksTime)
          this.addQuerys.weeks.push(i + 1)
          weeksNumber = ''
          weeksTime = ''
        }
        console.log(this.addQuerys)
      } else {
        this.queryInit()
      }
    },
    // 关闭设计
    closeDesign(done) {
      this.$confirm('确认关闭？ 将自动保存 ')
        .then(() => {
          this.saveDesign()
          done();
        })
        .catch(() => { });
    },
    // 查询单条
    find() {
      this.getLogData.curriculumName = this.query.trim()
      this.getData()
    },
    // 搜索清空还原
    clearSearch() {
      this.getLogData.curriculumName = ''
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
    // 批量删除
    handleSelectionChange(e) {
      this.delClassId = []
      e.forEach(item => {
        this.delClassId.push(item.id)
      })
    },
    // 删除
    async delClass() {
      if (this.delClassId.length == 0) {
        this.$Message.warning('请先勾选要删除的课程 !')
        return
      }
      let res = await delClass(this.delClassId)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.getData()
      }
    }
  },
}
</script>

<style scoped>
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
