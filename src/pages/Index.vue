<template>
  <div id="app">
    <el-container>
      <el-container style="height: 100%">
        <!-- 左侧导航栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 侧边栏菜单组件 -->
          <Aside :isCollapse="isCollapse"></Aside>
        </el-aside>
        <el-container>
          <!-- 头部 -->
          <el-header>
            <el-row :gutter="20">
              <!-- 折叠展开按钮 -->
              <el-col :span="4"
                ><div class="grid-content bg-purple header-left">
                  <el-button
                    type="primary"
                    :icon="
                      isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
                    "
                    circle
                    @click="closeNav"
                  ></el-button></div
              ></el-col>
              <el-col :span="12"
                ><div class="grid-content bg-purple"></div
              ></el-col>
              <!-- 右上角用户区域 -->
              <el-col :span="8"
                ><div class="grid-content bg-purple header-right userInfo">
                  <el-menu mode="horizontal" @select="user">
                    <el-submenu index="1">
                      <template slot="title">用户信息</template>
                      <el-menu-item index="myInfo">个人中心</el-menu-item>
                      <el-menu-item index="logout">退出登录</el-menu-item>
                    </el-submenu>
                  </el-menu>
                </div></el-col
              >
            </el-row>
          </el-header>
          <!-- 主体中心 -->
          <el-main>
            <transition
              name="animate__animated animate__bounce"
              enter-active-class="animate__fadeInUp"
              leave-active-class="animate__fadeInDown"
            >
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </transition>
          </el-main>
          <!-- 主体底部 -->
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
let elementResizeDetectorMaker = require("element-resize-detector");
import { resize } from "../echarts/online";
import { Debounce } from "../utils/common";
import "../assets/js/model";
import Aside from "../components/Aside.vue";
import "animate.css";
export default {
  name: "Index",
  data() {
    return {
      isCollapse: false,
      screenWidth: 1,
    };
  },
  watch: {
    // 通过窗口大小判断是否要折叠侧边栏
    screenWidth: {
      handler(val) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (val < 555) this.isCollapse = true;
          if (val > 812) this.isCollapse = false;
        }, 100);
      },
    },
  },
  created() {
    // 初始化时判断是否需要关闭侧边栏
    if (document.body.clientWidth < 555) {
      this.screenWidth = document.body.clientWidth;
    }
  },
  mounted() {

    // 监听窗口大小,更改侧边栏状态
    window.addEventListener(
      "resize",
      () => {
        // 防抖修改侧边栏
        this.Resize();
        // 直接修改echarts
        resize();
      },
      false
    );
    // 监听侧边栏动画结束，重新绘制echarts
    let erd = elementResizeDetectorMaker();
    let that = this;
    erd.listenTo(document.querySelector("Aside"), function () {
      that.$nextTick(function () {
        //使echarts尺寸重置
        resize();
      });
    });

  },
  components: { Aside },
  methods: {

    // 防抖更改echarts和aside
    Resize: Debounce(function () {
      this.screenWidth = document.body.clientWidth;
    }, 200),

    // 折叠侧边栏
    closeNav() {
      this.isCollapse = !this.isCollapse;
    },

    // 右上角用户信息
    user(index) {
      if (index == "myInfo") console.log("我的信息");
      if (index == "logout") {
        this.$Message({
          message: "退出登录成功！",
          type: "success",
          center: true,
        });
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      }
    },
  },
};
</script>

<style>
#app > section {
  height: 100%;
}
.el-header {
  width: 100%;
  height: 20%;
  background-color: #ffffff;
}
.el-aside {
  background-color: #28333e;
  color: #333;
  text-align: center;
  height: 100%;
}
.el-main {
  background-color: #f2f2f2;
}
.el-footer {
  background-color: #fff;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  background-color: red;
}
.header-left {
  display: flex;
  align-items: center;
}
.header-right {
  display: flex;
  align-items: center;
}
.grid-content {
  min-height: 60px;
}

.el-aside {
  transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -moz-transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -o-transition: width 0.25s;
}
/* 消失不占位 */
.animate__fadeInDown {
  display: none !important;
}
.userInfo {
  justify-content: end;
}
</style>