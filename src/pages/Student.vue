<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>

      <!-- 表格 -->
      <el-table :data="students" style="width: 100%" border stripe empty-text>
        <el-table-column prop="number" label="学号" sortable> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="sdept" label="院系"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="students.length"
      >
        <!-- ↑需要返回总数量 -->
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
/* 获取学生列表接口 */
import { students } from "../api";
export default {
  name: "Student",
  data() {
    return {
      students: [],
      // 列表参数
      queryInfo: {
        query: "",
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
    // 获取数据接口
    async getData() {
      try {
        this.students = await students(this.queryInfo);
      } catch {
        this.$Message.error("获取用户列表失败！");
      }
    },
    // 每条页多少条
    handleSizeChange(num) {
      this.queryInfo.pageSize = num;
      // 重新请求多少条
      this.getData();
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