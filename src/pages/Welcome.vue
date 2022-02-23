<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18"
        ><div class="grid-content bg-purple">
          <el-card id='allData'>数据统计</el-card>
        </div></el-col
      >
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <el-card id='notice'>公告</el-card>
        </div></el-col
      >
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24"
        ><div class="grid-content bg-purple">
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
    this.$nextTick(()=>{
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
</style>