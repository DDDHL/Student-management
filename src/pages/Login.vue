<template>
  <div>
    <Loading v-if="isLoading" />
    <div v-show="!isLoading">
      <div id="login">
        <div class="container">
          <div class="owl" :class="className" id="owl">
            <div class="hand"></div>
            <div class="hand hand-r"></div>
            <div class="arms">
              <div class="arm"></div>
              <div class="arm arm-r"></div>
            </div>
          </div>
          <div class="tit">休假管理系统</div>
          <el-form :rules="rules" :model="info" ref="form">
            <el-form-item prop="account">
              <el-input
                prefix-icon="el-icon-user-solid"
                type="text"
                placeholder="账号"
                v-model="info.account"
                class="first_input"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="密码"
                @focus="focus"
                @blur="blur"
                v-model="info.pwd"
                class="second_input"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="width: 280px; height: 40px">
            <el-checkbox v-model="info.rememberMe" style="margin: 20px 0 0 2px"
              >记住我</el-checkbox
            >
          </div>
          <button @click="login">登录</button>
        </div>
        <div class="square">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="circle">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 加密 */
import { Encrypt } from '../utils/secret'
/* 登录接口 */
import { login, isLogin } from '../api'
/* 路由接口 */
import { setRoutes } from "../router/router";
/* 加载 */
import Loading from '../components/Loading.vue'
export default {
  name: 'Login',
  components: { Loading },
  data() {
    return {
      isLoading: true,
      className: '',
      info: {
        account: '',
        pwd: '',
        rememberMe: false,
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  async created() {
    let res = localStorage.getItem('user')
    let router = localStorage.getItem('menus')
    if (res != null && res != '' && router != null && router != '') {
      let loginData = await isLogin()
      if (!loginData.code) {
        // 验证成功
        setRoutes();
        this.$router.push('/index')
      } else {
        // 验证失败
        localStorage.removeItem('menus')
        localStorage.removeItem('user')
        this.isLoading = false
      }
    } else {
      this.isLoading = false
    }
  },
  methods: {
    // 点击密码框动画
    focus() {
      this.className = 'password'
    },
    // 关闭密码框动画
    blur() {
      this.className = ''
    },
    // 登录
    login() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let password = Encrypt(this.info.pwd)
          // 请求登录
          let res = await login(this.info, password)
          // 判断登录是否成功
          if (res.code === '') {
            this.$Message.success(res.message)
            let user = {
              avatarUrl: res.data.avatarUrl,
              nickName: res.data.nickName,
              token: res.data.token,
              major: res.data.major,
              roles: res.data.roles
            }
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem("menus", JSON.stringify(res.data.menus));
            setRoutes();
            setTimeout(() => {
              // 成功后跳转
              this.$router.push('/index')
            }, 700)
          } else {
            // 登录失败后显示
            this.$Message.error(res.message)
          }

        }
      })
    },
  },
}
</script>

<style src="../assets/css/login.css" scoped></style>
