<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="请输入内容"
        v-model="query"
        clearable
        @clear="getData"
        style="width: 350px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>

      <el-button type="primary" style="margin: 20px 0 0 20px"
        >添加用户</el-button
      >
      <el-button type="primary" style="margin: 20px 0 0 20px"
        >删除用户</el-button
      >

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        stripe
        ref="filterTable"
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
          :filters="gradeData"
          :filter-method="filterHandlerGrade"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          width="150"
          :filters="majorData"
          align="center"
          :filter-method="filterHandlerMajor"
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
        :total="tableData.length"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
/* 获取学生列表接口 */
import { getAll } from "../api";
export default {
  name: "Teachers",
  data() {
    return {
      /* 年级筛选 */
      gradeData: [
        { text: "2018", value: "2018" },
        { text: "2019", value: "2019" },
        { text: "2020", value: "2020" },
        { text: "2021", value: "2021" },
      ],
      /* 专业筛选 */
      majorData: [
        { text: "软件工程", value: "软件工程" },
        { text: "树莓", value: "树莓" },
        { text: "英专", value: "英专" },
      ],
      /* 表格数据 */
      tableData: [],
      // 查询单条数据
      query: "",
      // 列表参数
      queryInfo: {
        // 当前页
        pagenum: 1,
        // 一页展示多少条
        pageSize: 1,
      },
    };
  },
  watch: {
    "queryInfo.query"(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
  },
  created() {
    /* 初始化获取数据 */
    this.getData();
  },
  methods: {
    // 筛选专业
    filterHandlerMajor(value, row, column) {
      console.log(value);
      console.log(row);
      console.log(column);
    },
    // 筛选年级
    filterHandlerGrade(value, row, column) {
      console.log(value);
      console.log(row);
      console.log(column);
    },
    // 查询单条
    find() {
      console.log(this.query);
    },
    // 点击行
    handleClick(row) {
      console.log(row);
    },
    // 获取数据接口
    async getData() {
      try {
        this.tableData = await getAll();
      } catch {
        this.$Message.error("获取用户列表失败！");
      }
    },
    // 修改每条页多少条
    handleSizeChange(num) {
      this.queryInfo.pageSize = num;
      // 重新请求多少条
      //this.getData();
    },
    // 当前页
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      // 请求当前页
    },
  },
};
</script>

<style>
</style>