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
              <el-col :span="16"
                ><div class="grid-content bg-purple"></div
              ></el-col>
              <el-col :span="4"
                ><div class="grid-content bg-purple header-right">
                  admin
                </div></el-col
              >
            </el-row>
          </el-header>
          <!-- 主体中心 -->
          <el-main>
            <router-view></router-view>
          </el-main>
          <!-- 主体底部 -->
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "../components/Aside.vue";
export default {
  name: "Index",
  data() {
    return {
      isCollapse: false,
      screenWidth:''
    };
  },
  watch:{
    screenWidth(val){
      if(val<'555') this.isCollapse=true
      if(val>'812') this.isCollapse=false
    }
  },
  mounted () {
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  },
  components: { Aside },
  methods: {
    closeNav() {
      this.isCollapse = !this.isCollapse;
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
  background-color: red;
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

</style>