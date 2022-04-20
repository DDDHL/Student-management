<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索角色"
        v-model="query"
        clearable
        @clear="clearSearch"
        style="width: 350px"
        @blur="blurSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="find"
        ></el-button>
      </el-input>
      <!-- 添加 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="centerDialogVisibleAdd = true"
        >添加角色<i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 添加角色弹窗 -->
      <el-dialog
        title="添加角色"
        :visible.sync="centerDialogVisibleAdd"
        width="430px"
        center
      >
        <!-- 添加角色表单 -->
        <el-form
          :model="newRole"
          label-width="65px"
          ref="newRole"
          style="margin-left: -10px"
        >
          <el-form-item label="描述" prop="value">
            <el-input v-model="newRole.description"></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="type">
            <el-input v-model="newRole.roleName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('newRole')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 删除角色 -->
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的角色"
        v-model="delPoppover"
      >
        <el-button
          type="danger"
          style="margin: 20px 0 0 20px"
          slot="reference"
          @click="delBtn"
          >批量删除<i class="el-icon-remove-outline"></i>
        </el-button>
      </el-popover>
      <el-dialog title="警告" :visible.sync="dialogVisibleDel" width="30%">
        <span>你确定要删除勾选的角色吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 表格 -->
      <el-table
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
        stripe
        @filter-change="filterChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" align="center">
        </el-table-column>

        <el-table-column
          prop="id"
          label="ID"
          sortable
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleRolePower(scope.row)"
              >分配权限<i class="el-icon-edit"></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleEditRole(scope.row)"
              >编辑信息<i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限弹窗 -->
      <el-dialog
        title="分配权限"
        :visible.sync="centerDialogVisiblePower"
        width="430px"
        center
      >
        <!-- 分配权限树 -->
        <el-tree
          :data="rolePowerTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="myCheckedKeys"
          :props="defaultProps"
          @check="currentChecked"
          default-expand-all
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisiblePower = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('rolePowerTree')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 编辑角色弹窗 -->
      <el-dialog
        title="编辑角色信息"
        :visible.sync="centerDialogVisibleEdit"
        width="430px"
        center
      >
        <!-- 编辑角色表单 -->
        <el-form
          :model="editRole"
          label-width="65px"
          ref="editRole"
          style="margin-left: -10px"
        >
          <el-form-item label="描述" prop="description">
            <el-input v-model="editRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色名" prop="description">
            <el-input v-model="editRole.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editRole')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
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
/* 获取角色列表接口 */
import {
  roleGetAll,
  dictGetType,
  roleEdit,
  roleDel,
  rolePower,
  getAllMenusByRole,
  setRole
} from '../api'
/* 下载文件 */

export default {
  name: 'Role',
  data() {
    return {
      // Tree选中的值
      myCheckedKeys: [],
      // 编辑权限后的id
      menuIds: [],
      // 分配权限树
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },
      // 权限树数据
      rolePowerTree: [],
      // 角色权限
      rolePowerList: {
        login: false,
        roleId: 0,
        roleIds: [],
      },
      // 角色类型
      dictTypes: [],
      // 增加角色弹窗
      centerDialogVisibleAdd: false,
      // 编辑角色弹窗
      centerDialogVisibleEdit: false,
      // 分配权限弹窗
      centerDialogVisiblePower: false,
      // 删除角色
      dialogVisibleDel: false,
      delPoppover: false,
      // 勾选的角色
      ids: [],
      // 表格数据
      total: 0,
      // 新增角色
      newRole: {},
      // 编辑角色
      editRole: {},
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
      },
    }
  },
  watch: {
    centerDialogVisibleEdit(newValue) {
      if (!newValue) {
        // 关闭编辑就重新获取表格
        this.dictTypes = []
        this.getData()
      }
    },
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  methods: {
    // 点击分配权限
    async handleRolePower(row) {
      this.rolePowerList.roleId = row.id
      let res = await rolePower(this.rolePowerList)
      let resTree = await getAllMenusByRole()
      if (res.code == '' && resTree.code == '') {
        this.rolePowerTree = resTree.data
        this.myCheckedKeys = res.data
        this.centerDialogVisiblePower = true
      }
    },
    // 点击编辑角色
    async handleEditRole(row) {
      this.editRole = row
      this.centerDialogVisibleEdit = true
    },
    // 删除角色按钮
    async delBtn() {
      if (this.ids.length == 0) {
        // 未勾选
        this.delPoppover = true
        setTimeout(() => {
          this.delPoppover = false
        }, 1000)
      } else {
        this.dialogVisibleDel = true
      }
    },
    // 删除角色请求
    async del() {
      // 删除角色
      let res = await roleDel(this.ids)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.getData()
        this.dialogVisibleDel = false
      }
    },
    // 选择多条
    handleSelectionChange(val) {
      if (val.length > 0) {
        let data = []
        val.forEach((item) => {
          data.push(item.id)
        })
        this.ids = data
        data = []
      } else {
        // 清空
        this.ids = []
      }
    },
    // 提交表单  包含编辑和新增
    async submitForm(val) {
      if (val == 'editRole') {
        // 编辑角色
        let res = await roleEdit(this.editRole)
        if (res.code == '') {
          // 修改成功
          this.$Message.success(res.message)
          this.centerDialogVisibleEdit = false
        }
      } else {
        // 分配权限
        let res = await setRole({ roleId: this.rolePowerList.roleId, menuIds: this.menuIds })
        if (res.code == '') {
          this.$Message.success(res.message + '! 重新登录即可更新菜单 !')
        }
        this.centerDialogVisiblePower = false
      }
    },
    // Tree选择节点
    currentChecked(nodeObj, SelectedObj) {
      this.menuIds = SelectedObj.checkedKeys // 这是选中的节点的key数组
    },
    // 筛选专业
    filterChange(obj) {
      console.log(obj)
      if (obj.filterTag.length == 0) {
        // 重置重新获取
        console.log('重置')
        this.queryInfo.dictType = ''
        this.getData()
      } else {
        // 筛选 遗留bug，后端应该接收数组
        obj.filterTag.forEach((item) => {
          this.queryInfo.dictType = item
        })
        this.getData()
      }
    },
    // 查询单条
    find() {
      this.queryInfo.roleName = this.query.trim()
      this.getData()
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.roleName = ''
      this.getData()
    },
    // 手动删除search
    blurSearch() {
      if (this.query == '') {
        this.clearSearch()
      }
    },
    // 获取数据接口
    async getData() {
      this.dictTypes = []
      let res = await roleGetAll(this.queryInfo)
      let resType = await dictGetType()
      if (res.code == '' && resType.code == '') {
        this.tableData = res.data.records
        this.total = res.data.total
        let a = {
          text: '',
          value: ''
        }
        resType.data.forEach((item) => {
          a.text = item.value
          a.value = item.value
          this.dictTypes.push(a)
        })
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
  },
}
</script>

<style scoped>
/deep/.el-card__body {
  padding: 0 20px 10px 20px;
}
</style>