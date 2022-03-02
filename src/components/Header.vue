<template>
  <div>
    <el-header>
      <el-row :gutter="20">
        <!-- 折叠展开按钮 -->
        <el-col :span="2">
          <div style="font-size: 28px; padding-top: 10px">
            <span
              style="cursor: pointer"
              @click="closeNav"
              :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            ></span>
          </div>
        </el-col>
        <el-col :span="14"
          ><div class="grid-content">
            <!-- 面包屑 -->
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              style="padding-top: 21px; font-size: 16px"
            >
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{
                this.$store.state.aside.name
              }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div></el-col
        >
        <!-- 右上角用户区域 -->
        <el-col :span="8"
          ><div class="grid-content bg-purple header-right userInfo">
            <!-- 头像 -->
            <div class="demo-type" style="height: 40px; width: 40px">
              <el-avatar :size="40" src="https://empty" @error="errorHandler">
                <img :src="dynamicValidateForm.avatarUrl" />
              </el-avatar>
            </div>
            <el-menu mode="horizontal" @select="user">
              <el-submenu index="1">
                <template slot="title">{{
                  dynamicValidateForm.nickName
                }}</template>
                <el-menu-item index="myInfo" @click="dialogFormVisible = true"
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
            <el-form-item label="密码" prop="pass">
              <el-input
                type="password"
                v-model="ruleForm.pass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                autocomplete="off"
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
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style>
</style>