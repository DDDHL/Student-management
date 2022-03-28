<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索 学/工号 或 名字"
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
      <!-- 日期筛选 -->
      <el-date-picker
        style="margin: 10px 10px 10px 0"
        v-model="value2"
        type="datetimerange"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="dateChange"
      >
      </el-date-picker>
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
        <el-table-column prop="userAccount" label="学/工号" align="center" />
        <el-table-column prop="nickName" label="姓名" align="center" />
        <el-table-column prop="module" label="模块" align="center" />
        <el-table-column prop="ip" label="IP" align="center" />
        <el-table-column prop="remark" label="操作" align="center" />
        <el-table-column
          prop="operationTime"
          label="时间"
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
import { getLog } from '../api'
export default {
  name: 'Log',
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
        endTime: "",
        nickName: "",
        pageNum: 1,
        pageSize: 10,
        startTime: "",
        userAccount: ""
      },
      tatol: 0,
      // 日期筛选
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
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
        let res = await getLog(this.getLogData);
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
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