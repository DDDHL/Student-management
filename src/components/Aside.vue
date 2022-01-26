<template>
  <div>
    <!-- 侧边logo -->
    <div class="logo">
      <router-link to="/welcome">
      <img src="../assets/images/logo.png" alt="logo" />
      <transition
        name="animate__animated animate__bounce"
        enter-active-class="animate__fadeInLeft"
        leave-active-class="animate__zoomOut"
      >
        <p v-show="!isCollapse">休假管理系统</p>
      </transition>
      </router-link>
    </div>
    <!-- 侧边导航栏 -->
    <el-menu
      background-color="#28333e"
      text-color="#fff"
      active-text-color="#1e9fff"
      router
      :collapse="isCollapse"
      unique-opened
      :default-active="$route.path"
    >
      <el-menu-item
        :index="'/' + navItem.navPath"
        v-for="navItem in navList"
        :key="navItem.id"
      >
        <i class="el-icon-menu"></i>
        <span slot="title">{{ navItem.navName }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { navList } from "../api";
import "animate.css";
export default {
  name: "Aside",
  props: ["isCollapse"],
  data() {
    return {
      navList: {},
    };
  },
  async created() {
    /* 遍历左侧导航 */
    try {
      this.navList = await navList();
    } catch {
      console.log("访问数据失败");
    }
  },
};
</script>

<style scoped>
.logo {
  background-color: #192027;
  height: 60px;
  color: #fff;
  line-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.logo >a> p {
  margin: 0;
  display: inline-block;
  padding-left: 10px;
  --animate-duration: 0.2s;
}

.el-menu {
  border: none;
  padding-left: 0;
  transition: all 10ms;
}
.logo >a> img {
  width: 50px;
  height: 50px;
}
.logo>a{
  display: flex;
  align-items: center;
  text-decoration: none;  
  color: #fff;
}
/deep/ .el-menu-item {
  padding-left: 0 !important;
}
</style>