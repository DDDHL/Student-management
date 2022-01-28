<template>
  <div>
    <h2>Welcome</h2>
    <el-row :gutter="20">
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card>111</el-card>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-card>222</el-card>
      </div></el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24"><div class="grid-content bg-purple">
        <el-card>111</el-card>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style>
</style>