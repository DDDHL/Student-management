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

    <!-- 侧边栏 -->
    <el-menu
      background-color="#28333e"
      text-color="#fff"
      active-text-color="#1e9fff"
      router
      :collapse="isCollapse"
      unique-opened
      :default-active="$route.path"
    >
      <fragment v-for="item in menus" :key="item.id">
        <!-- 遍历生成一级菜单 -->
        <fragment v-if="item.path">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title" style="padding-right: 5px">{{
              item.menuName
            }}</span>
          </el-menu-item>
        </fragment>
        <!-- 遍历生成二级菜单 -->
        <fragment v-else>
          <el-submenu :index="item.id + ''">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title" style="padding-right: 5px">{{
                item.menuName
              }}</span>
            </template>
            <fragment v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item :index="subItem.path">
                <template slot="title">
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{ subItem.menuName }}</span>
                </template>
              </el-menu-item>
            </fragment>
          </el-submenu>
        </fragment>
      </fragment>
    </el-menu>
  </div>
</template>

<script>
import "animate.css";
export default {
  name: "Aside",
  props: ["isCollapse"],
  data() {
    return {
      menus: {},
    };
  },
  created() {
    /* 遍历左侧导航 */
    this.menus = JSON.parse(localStorage.getItem("menus"));
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
.logo > a > p {
  margin: 0;
  display: inline-block;
  padding-left: 10px;
  --animate-duration: 0.8s;
}

.el-menu {
  border: none;
  transition: all 10ms;
}
.logo > a > img {
  width: 50px;
  height: 50px;
}
.logo > a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}
.el-menu-item span {
  padding-left: -5px;
}
/* 消失不占位 */
.animate__zoomOut {
  display: none !important;
}
/* 二级菜单缩进 */
.el-submenu .el-menu-item {
  padding-right: 15px;
}
</style>