<template>
  <div>
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索学号或者名字"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 350px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>
      <!-- 添加用户 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="centerDialogVisibleAdd = true"
        >添加用户</el-button
      >
      <!-- 添加学生弹窗 -->
      <el-dialog
        title="添加学生"
        :visible.sync="centerDialogVisibleAdd"
        width="430px"
        center
      >
        <!-- 添加学生表单 -->
        <el-form
          :model="newStudent"
          label-width="65px"
          ref="newStudent"
          :rules="rules"
          style="margin-left: -10px"
        >
          <el-form-item label="学号" prop="userAccount">
            <el-input v-model="newStudent.userAccount"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="newStudent.nickName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="newStudent.sex"
              placeholder="请选择性别"
              style="width: 325px"
            >
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="newStudent.grade"></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="department">
            <el-input v-model="newStudent.department"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="majors">
            <el-input v-model="newStudent.majors"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="newStudent.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="newStudent.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('newStudent')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 删除学生 -->
      <el-button type="primary" style="margin: 20px 0 0 20px"
        >删除学生</el-button
      >
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        stripe
        @filter-change="filterChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column prop="id" label="ID" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="userAccount"
          label="学号"
          width="150"
          sortable
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="姓名"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="department"
          label="学院"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="grade"
          label="年级"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="major"
          label="专业"
          width="150"
          align="center"
          :filters="majorData"
          column-key="filterTag"
        >
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style=""
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
/* 获取学生列表接口 */
import { getAll } from '../api'
export default {
  name: 'Students',
  data() {
    /* 手机号规则 */
    var validatorPhone = function (rule, value, callback) {
      let phone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!phone.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 手机号邮箱验证
      rules: {
        phone: [
          {
            required: true,
            validator: validatorPhone,
            trigger: ['blur', 'change'],
          },
        ],
        email: [
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
        ],
        majors: [
          {
            required: true,
            message: '专业不能为空',
            trigger: 'blur',
          },
        ],
        department: [
          {
            required: true,
            message: '学院不能为空',
            trigger: 'blur',
          },
        ],
        nickName: [
          {
            required: true,
            message: '名字不能为空',
            trigger: 'blur',
          },
        ],
        userAccount: [
          {
            required: true,
            message: '学号不能为空',
            trigger: 'blur',
          },
        ],
        sex: [
          {
            required: true,
            message: '性别不能为空',
            trigger: 'blur',
          },
        ],
        grade: [
          {
            required: true,
            message: '年级不能为空',
            trigger: 'blur',
          },
        ]
      },
      // 删除和增加学生弹窗
      centerDialogVisibleAdd: false,
      // 专业筛选
      majorData: [
        { text: '软件工程', value: '软件工程' },
        { text: '树莓', value: '树莓' },
        { text: '计算机科学与技术', value: '计算机科学与技术' },
      ],
      // 表格数据
      total: 0,
      // 新增学生
      newStudent: {},
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        majors: [],
        nickName: '',
        // 当前页
        pageNum: 1,
        // 一页展示多少条
        pageSize: 10,
        userAccount: '',
      },
    }
  },
  watch: {
    'queryInfo.query'(newValue, oldValue) {
      console.log(newValue, oldValue)
    },
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  methods: {
    // 选择多条
    handleSelectionChange(val) {
      val.forEach(item => {
        console.log(item.id);
      });
    },
    // 提交表单
    submitForm(val) {
      console.log('表单:', val)
      this.$refs[val].validate((valid) => {
        if (valid) {
          console.log(this.newStudent)
          this.centerDialogVisibleAdd = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 筛选专业
    filterChange(obj) {
      this.queryInfo.majors = obj.filterTag
      this.getData()
    },
    // 查询单条
    find() {
      if (isNaN(this.query)) {
        this.queryInfo.nickName = this.query.trim()
        this.getData()
      } else {
        this.queryInfo.userAccount = this.query.trim()
        this.getData()
      }
      this.queryInfo.nickName = ''
      this.queryInfo.userAccount = ''
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.nickName = ''
      this.queryInfo.userAccount = ''
      this.getData()
    },
    // 点击行
    handleClick(row) {
      console.log(row)
    },
    // 获取数据接口
    async getData() {
      try {
        let res = await getAll(this.queryInfo)
        if (!res.code) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$Message.error(res.message)
        }
      } catch {
        this.$Message.error('获取用户列表失败！')
      }
    },
    // 修改每条页多少条
    handleSizeChange(num) {
      this.queryInfo.pageSize = num
      this.getData()
    },
    // 修改当前页
    handleCurrentChange(num) {
      this.queryInfo.pageNum = num
      this.getData()
    },
    // 减少和增加用户弹窗
  },
}
</script>

<style></style>
