<template>
  <div>
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
        >添加用户</el-button
      >
      <!-- 添加用户弹窗 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisibleAdd"
        width="30%"
        center
      >
        <!-- 添加用户表单 -->

        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogVisibleAdd = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 删除用户 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="centerDialogVisibleDec = true"
        >删除用户</el-button
      >
      <!-- 删除用户弹窗 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisibleDec"
        width="30%"
        center
      >
        <span>删除用户</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleDec = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogVisibleDec = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        stripe
        @filter-change="filterChange"
      >
        <el-table-column fixed type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="userAccount"
          label="学号"
          width="150"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="姓名"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="department"
          label="学院"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="grade"
          label="年级"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          width="150"
          align="center"
          :filters="majorData"
          column-key="filterTag"
        >
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style=""
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
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
/* 获取学生列表接口 */
import { getAll } from '../api'
export default {
  name: 'Students',
  data() {
    return {
      // 删除和增加用户弹窗
      centerDialogVisibleDec: false,
      centerDialogVisibleAdd: false,
      // 专业筛选
      majorData: [
        { text: '软件工程', value: '软件工程' },
        { text: '树莓', value: '树莓' },
        { text: '计算机科学与技术', value: '计算机科学与技术' },
      ],
      // 表格数据
      total: 0,
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        majors: [],
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
    // 筛选专业
    filterChange(obj) {
      this.queryInfo.majors = obj.filterTag
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
    // 失焦查看是否还原
    blurSearch() {
      /* if (this.query == '') {
        this.getData()
      } */
      console.log('失去焦点');
    },
    // 点击行
    handleClick(row) {
      console.log(row)
    },
    // 获取数据接口
    async getData() {
      try {
        let res = await getAll(this.queryInfo)
        if (!res.code) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$Message.error(res.message)
        }

      } catch {
        this.$Message.error('获取用户列表失败！')
      }
    },
    // 修改每条页多少条
    handleSizeChange(num) {
      this.queryInfo.pageSize = num
      this.getData();
    },
    // 修改当前页
    handleCurrentChange(num) {
      this.queryInfo.pageNum = num
      this.getData();
    },
    // 减少和增加用户弹窗
  },
}
</script>

<style></style>
