<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18"
        ><div>
          <el-card id="allData">数据统计</el-card>
        </div></el-col
      >
      <el-col :span="6"
        ><div>
          <el-card id="notice">
            <div class="noticeTitle">公告栏</div>
            <ul>
              <li>欢迎使用新华的湖学校后台管理系统</li>
              <li>学生、班级管理页面支持批量导入导出</li>
              <li>学校管理页面支持快速新建院系、专业、班级</li>
              <li>系统管理页面功能齐全,能便捷管理系统各项功能</li>
            </ul>
          </el-card>
        </div></el-col
      >
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24"
        ><div>
          <el-card id="online">表格渲染中...</el-card>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { online } from "../echarts/online";
export default {
  name: "Welcome",
  mounted() {
    this.$nextTick(() => {
      online()
    })
  },
};
</script>

<style scoped>
/* online图表 */
#online {
  width: 98%;
  height: 550px;
  margin-top: 20px;
  padding: 15px 1% 0 1%;
}
h2 {
  margin: 0 0 10px 0;
}
/* 详情数据表 */
#allData {
  height: 180px;
}
/* 公告栏 */
#notice {
  height: 180px;
}
ul {
  padding-inline-start: 20px;
  list-style-position: inside;
}
li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.noticeTitle {
  white-space: nowrap;
  overflow: hidden;
}
</style>