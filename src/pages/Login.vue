<template>
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
        <el-form-item  prop="account">
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
</template>

<script>
/* import {Test} from "../api" */
export default {
  name: "Login",
  data() {
    return {
      className: "",
      info:{
         account: "",
          pwd: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 点击密码框动画
    focus() {
      this.className = "password";
    },
    // 关闭密码框动画
    blur() {
      this.className = "";
    },
    // 登录
    login() {
      /* this.$refs.form.validate(async (valid)=>{
        if(valid){
          try{
            // 请求登录成功
            let a = await Login(this.info.account)
            console.log(a)
            // 跳转

          }catch{
            // 请求登录失败
            console.log('请求失败')
          }
        }else{
          console.log(valid);
        }
      }) */
      this.$refs.form.validate(async (valid)=>{
        if(valid){
          this.$Message({
            message:'登录成功！',
            type:'success',
            center:true
          })
          this.$router.push("/index")
        }
        else this.$Message.error('登录失败！')
      })
      
    },
  },
};
</script>

<style src="../assets/css/login.css" scoped></style>
