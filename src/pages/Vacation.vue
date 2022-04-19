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
export default {
  name: 'Vacation',
  data() {
    return {
      // 搜索参数
      query: '',
      // 请求参数
      queryInfo: {
        curriculumId: 0,
        pageNum: 1,
        pageSize: 10
      },
      // 表格总数
      total: 0
    }
  },
  created() {
    // 设置查询课程的id
    this.queryInfo.curriculumId = this.$store.state.curriculumId
  },
  methods: {
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
  }
}
</script>

<style>
</style>
