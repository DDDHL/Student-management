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
              <el-col :span="11">
                <div
                  style="
                    font-size: 28px;
                    padding-top: 15px;
                    display: flex;
                    align-items: center;
                  "
                >
                  <div
                    style="cursor: pointer"
                    @click="closeNav"
                    :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                  ></div>
                  <!-- 面包屑 -->
                  <el-breadcrumb
                    separator-class="el-icon-arrow-right"
                    style="padding-left: 8px; font-size: 16px"
                  >
                    <el-breadcrumb-item :to="{ path: '/welcome' }"
                      >首页</el-breadcrumb-item
                    >
                    <el-breadcrumb-item>{{
                      currentPathName
                    }}</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </el-col>
              <!-- 右上角用户区域 -->
              <el-col :span="13"
                ><div class="grid-content bg-purple header-right userInfo">
                  <!-- 右上角头像 -->
                  <div class="demo-type" style="height: 40px; width: 40px">
                    <el-avatar :size="40">
                      <img
                        v-if="dynamicValidateForm.avatarUrl"
                        :src="dynamicValidateForm.avatarUrl"
                        alt=""
                      />
                    </el-avatar>
                  </div>
                  <el-menu mode="horizontal" @select="user">
                    <el-submenu index="1">
                      <template slot="title">{{
                        dynamicValidateForm.nickName
                      }}</template>
                      <el-menu-item
                        index="myInfo"
                        @click="dialogFormVisible = true"
                        >修改信息</el-menu-item
                      >
                      <el-menu-item index="logout">退出登录</el-menu-item>
                    </el-submenu>
                  </el-menu>
                </div></el-col
              >
            </el-row>
          </el-header>
          <!-- 修改用户信息弹窗 -->
          <el-dialog
            title="修改个人信息"
            :visible.sync="dialogFormVisible"
            center
            width="450px"
          >
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="handleClick"
              style="margin-left: 0"
            >
              <el-tab-pane label="基本信息" name="first">
                <!-- 头像修改 -->
                <el-upload
                  style="text-align: center"
                  class="avatar-uploader"
                  action="http://113.78.180.19:9568/file/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="dynamicValidateForm.avatarUrl"
                    :src="dynamicValidateForm.avatarUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <!-- 基本信息修改 -->
                <el-form
                  :rules="rules"
                  :model="dynamicValidateForm"
                  ref="dynamicValidateForm"
                  label-width="100px"
                  class="demo-dynamic"
                  style="margin: 20px 0 0 -35px"
                >
                  <el-form-item label="姓名">
                    <el-input
                      v-model="dynamicValidateForm.nickName"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="工号">
                    <el-input
                      v-model="dynamicValidateForm.userAccount"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="院系">
                    <el-input
                      v-model="dynamicValidateForm.department"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="年级">
                    <el-input
                      v-if="dynamicValidateForm.grade"
                      v-model="dynamicValidateForm.grade"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-input
                      v-model="dynamicValidateForm.sex"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="dynamicValidateForm.phone" />
                  </el-form-item>
                  <el-form-item
                    prop="email"
                    label="邮箱"
                    :rules="[
                      {
                        required: true,
                        message: '邮箱地址不能为空',
                        trigger: 'blur',
                      },
                      {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change'],
                      },
                    ]"
                  >
                    <el-input v-model="dynamicValidateForm.email"></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="second">
                <!-- 密码修改 -->
                <el-form
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                  style="margin: 20px 0 0 -30px"
                >
                  <el-form-item label="原密码" prop="OldPass">
                    <el-input
                      type="password"
                      v-model="ruleForm.OldPass"
                      show-password
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="pass">
                    <el-input
                      type="password"
                      v-model="ruleForm.pass"
                      autocomplete="off"
                      show-password
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input
                      type="password"
                      v-model="ruleForm.checkPass"
                      autocomplete="off"
                      show-password
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="submitForm(tab ? 'ruleForm' : 'dynamicValidateForm')"
                >确 定</el-button
              >
            </div>
          </el-dialog>
          <!-- 主体中心 -->
          <el-main>
            <transition
              name="animate__animated animate__bounce"
              enter-active-class="animate__fadeInUp"
              leave-active-class="animate__fadeInDown"
            >
              <!-- 组件插入区 -->
              <router-view></router-view>
            </transition>
          </el-main>
          <!-- 主体底部 -->
          <el-footer>
            <Footer />
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* API */
import { getMyInfo, changeUserInfo, changPwd } from "../api";

/* 监视元素插件 */
let elementResizeDetectorMaker = require("element-resize-detector");

/* echarts动态修改大小 */
import { resize } from "../echarts/online";
/* 防抖 */
import { Debounce } from "../utils/common";

/* 左下角模型 */
import "../assets/js/model";

/* 加密 */
import { Encrypt } from "../utils/secret"
/* 组件 */
import Aside from "../components/Aside.vue";
import Footer from "../components/Footer.vue";
/* 动画库 */
import "animate.css";
export default {
  name: "Index",
  data() {
    /* 密码校验规则 */
    var validatePass = (rule, value, callback) => {
      if (value.toString().length < 6) {
        callback(new Error("长度必须大于6位"));
      } else if (value.toString().length > 15) {
        callback(new Error("长度必须小于15位"));
      } else if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value.toString().length < 6) {
        callback(new Error("长度必须大于6位"));
      } else if (value.toString().length > 15) {
        callback(new Error("长度必须小于15位"));
      } else if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    /* 原密码规则 */
    var validatePass3 = (rule, value, callback) => {
      if (value.toString().length < 6) {
        callback(new Error("长度必须大于6位"));
      } else if (value.toString().length > 15) {
        callback(new Error("长度必须小于15位"));
      } else {
        callback();
      }
    };
    /* 手机号规则 */
    var validatorPhone = function (rule, value, callback) {
      let phone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!phone.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      /* 用户信息弹窗 */
      /* 头像 */
      imageUrl: "",
      /* 基本信息 */
      dynamicValidateForm: {},
      /* 密码 */
      ruleForm: {
        pass: "",
        checkPass: "",
        OldPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        OldPass: [{ validator: validatePass3, trigger: "blur" }],
        phone: [
          {
            required: true,
            validator: validatorPhone,
            trigger: ["blur", "change"],
          },
        ],
      },
      activeName: "first",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      tab: false,
      /* 响应式 */
      isCollapse: false,
      screenWidth: 1,
    };
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName;
    },
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
    // 获取用户头像
    this.user("myInfo");
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
      console.log("监听");
      that.$nextTick(function () {
        //使echarts尺寸重置
        resize();
      });
    });
  },
  components: { Aside, Footer },
  methods: {
    // 用户信息修改
    // 更新头像
    handleAvatarSuccess(res) {
      this.dynamicValidateForm.avatarUrl = res;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$Message({
          message: "上传头像图片只能是 JPG 格式!",
          type: 'error',
          center: true,
        })
      }
      if (!isLt2M) {
        this.$Message({
          message: "上传头像图片大小不能超过 2MB!",
          type: 'error',
          center: true,
        })
      }
      return isJPG && isLt2M;
    },
    // 修改密码或个人信息
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 验证通过
          if (formName == "ruleForm") {
            // 修改密码请求
            try {
              let newPass = Encrypt(this.ruleForm.pass)
              let oldPass = Encrypt(this.ruleForm.OldPass)
              let res = await changPwd(newPass, oldPass)
              if (res.code) {
                this.$Message({
                  message: res.message,
                  type: 'error',
                  center: true,
                })
              } else {
                this.$Message({
                  message: res.message,
                  type: 'success',
                  center: true,
                })
                this.dialogFormVisible = false;
                // 成功后清除用户信息退出登录
                localStorage.removeItem('user')
                /* localStorage.removeItem('menus') */
                this.$router.push('/login')
              }
            } catch (error) {
              this.$Message({
                message: error,
                type: 'error',
                center: true,
              })
            }
          } else {
            // 修改个人信息
            try {
              let res = await changeUserInfo(this.dynamicValidateForm)
              if (res.code) {
                this.$Message({
                  message: res.message,
                  type: 'error',
                  center: true,
                })
              } else {
                this.$Message({
                  message: res.message,
                  type: 'success',
                  center: true,
                })
                this.dialogFormVisible = false;
                // 成功后重新获取用户信息
                this.user("myInfo");
              }
            } catch (error) {
              this.$Message({
                message: error,
                type: 'error',
                center: true,
              })
            }
          }
          /* this.dialogFormVisible = false; */
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 修改用户信息标签页
    handleClick(tab) {
      if (tab.index == 1) {
        this.tab = true;
      } else {
        this.tab = false;
      }
    },
    // 防抖更改echarts和aside
    Resize: Debounce(function () {
      this.screenWidth = document.body.clientWidth;
    }, 200),

    // 折叠侧边栏
    closeNav() {
      this.isCollapse = !this.isCollapse;
    },

    // 右上角用户信息
    async user(index) {
      if (index == "myInfo") {
        try {
          let res = await getMyInfo();
          if (res.code == "") {
            // 赋值
            this.dynamicValidateForm = res.data;
          }
        } catch (error) {
          this.$Message({
            message: error,
            type: "error",
            center: true,
          });
        }
      }
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

<style scoped>
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
/* 修改个人信息标签 */
.el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
/* 修改个人信息头像 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>