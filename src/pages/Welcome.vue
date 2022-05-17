<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18"
        ><div>
          <el-card class="allData">
            <div class="data">
              <div class="data_item">
                <div style="margin-top: 20px; font-size: 18px">待审批休假</div>
                <el-divider></el-divider>
                <div>
                  <div>10</div>
                  <div>
                    <el-divider direction="vertical"></el-divider>
                    <span style="font-size: 16px; line-height: 20px">
                      比昨天下降</span
                    >
                    <i class="el-icon-bottom" style="color: red"></i>
                  </div>
                </div>
              </div>
              <div class="data_item">
                <div style="margin-top: 20px; font-size: 18px">已审批休假</div>
                <el-divider></el-divider>
                <div>
                  <div>31</div>
                  <div>
                    <el-divider direction="vertical"></el-divider>
                    <span style="font-size: 16px; line-height: 20px">
                      比昨天上升</span
                    >
                    <i class="el-icon-top" style="color: green"></i>
                  </div>
                </div>
              </div>
              <div class="data_item">
                <div style="margin-top: 20px; font-size: 18px">学院总人数</div>
                <el-divider></el-divider>
                <div>
                  <div>23</div>
                  <i
                    class="el-icon-s-custom"
                    style="color: blue; margin-top: 5px"
                  ></i>
                </div>
              </div>
            </div>
            <div id="gradeNum" class="gradeNum"></div>
          </el-card></div
      ></el-col>
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
import { gradeNum } from "../echarts/gradeNum"
import { getEchartData } from "../api"
export default {
  name: "Welcome",
  data() {
    return {
      gradeNums: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let res = await getEchartData()
      this.gradeNums = []
      res.data.各年级分布情况.forEach(item => {
        this.gradeNums.push({ value: item.num, name: item.grade })
      })
      console.log(res.data)
      this.gradeNums.sort((a, b) => b.value - a.value)
      this.$nextTick(() => {
        online()
        gradeNum(this.gradeNums)
      })
    }
  }
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
.allData {
  height: 180px;
  width: 100%;
}
.data {
  display: flex;
  width: 70%;

  height: 180px;
}
.data_item {
  width: 32%;
  height: 150px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  font-size: 30px;
  align-items: center;
  margin-left: 13px;
  border-radius: 5px;
}
.data_item > div:nth-child(1) {
  font-size: 13px;
}
.data_item > div:nth-child(3) {
  display: flex;
}
.gradeNum {
  height: 180px;
  width: 25%;
  margin: -200px 0 0 75%;
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