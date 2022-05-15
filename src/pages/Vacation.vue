<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索假单"
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
      <!-- 表格 -->
      <el-table :data="data" border style="width: 100%">
        <el-table-column fixed prop="id" label="ID" width="50" align="center">
        </el-table-column>
        <el-table-column prop="nickName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="grade" label="年级" align="center">
        </el-table-column>
        <el-table-column prop="major" label="专业" align="center">
        </el-table-column>
        <el-table-column prop="leaveStartTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="leaveEndTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column prop="leaveReason" label="休假原因" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.data.length"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getVacation } from '../api/'
export default {
  name: 'Vacation',
  data() {
    return {
      // 搜索参数
      query: '',
      // 请求参数
      queryInfo: {
        "endTime": "",
        "nickName": "",
        "pageNum": 1,
        "pageSize": 10,
        "startTime": "",
        "state": "",
        "userAccount": ""
      },
      data: []
    }
  },
  created() {
    // 设置查询课程的id
    this.queryInfo.curriculumId = this.$store.state.curriculumId
    this.getData()
  },
  methods: {
    async getData() {
      let res = await getVacation(this.queryInfo)
      if (res.code == '') {
        this.data = res.data.records
      }
    },
    handleClick(row) {
      console.log(row);
    },
    // 查询单条
    find() {
      this.queryInfo.nickName = this.query.trim()
      this.getData()
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.nickName = ''
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
  }
}
</script>

<style>
</style>
