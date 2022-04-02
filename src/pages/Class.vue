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
      <el-button type="primary"
        >新键班级 <i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 日志表格 -->
      <el-table
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
        <el-table-column prop="nickName" label="任课老师" align="center" />
        <el-table-column prop="module" label="班级人数" align="center" />
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
import { getClass } from '../api'
export default {
  name: 'Class',
  data() {
    return {
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
    }
  },
  created() {
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

<style>
</style>