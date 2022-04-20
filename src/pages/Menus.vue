<template>
  <div>
    <el-card>
      <el-input
        placeholder="搜索菜单"
        v-model="data.menuName"
        clearable
        @clear="reset"
        @blur="blurSearch"
        style="width: 350px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="load"
        ></el-button>
      </el-input>

      <!-- 新增菜单 -->
      <el-button type="primary" @click="handleAdd" style="margin: 20px 0 0 20px"
        >新增一级菜单 <i class="el-icon-circle-plus-outline"></i
      ></el-button>

      <!-- 批量删除菜单 -->
      <el-button type="danger" @click="delBatch" style="margin: 20px 0 0 20px"
        >批量删除 <i class="el-icon-remove-outline"></i
      ></el-button>

      <el-table
        :header-cell-style="{
          background: '#ebeef5',
          color: '#282c34',
        }"
        :data="tableData"
        border
        stripe
        :header-cell-class-name="headerBg"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="menuName" label="菜单名称" align="center" />
        <el-table-column prop="path" label="菜单路径" align="center" />
        <el-table-column prop="pagePath" label="页面路径" align="center" />
        <el-table-column
          label="菜单图标"
          class-name="fontSize18"
          align="center"
          label-class-name="fontSize12"
        >
          <template slot-scope="scope">
            <i :class="scope.row.icon" style="font-size: 20px" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleAdd(scope.row.id)"
              v-if="!scope.row.pid && !scope.row.path"
              >新增 <i class="el-icon-plus"></i
            ></el-button>
            <el-button
              type="success"
              @click="handleEdit(scope.row)"
              size="small"
              style="margin-right: 10px"
              >编辑 <i class="el-icon-edit"></i
            ></el-button>
            <el-popconfirm
              class="ml-5"
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗?"
              @confirm="del(scope.row.id)"
            >
              <el-button slot="reference" type="danger" size="small"
                >删除 <i class="el-icon-delete"></i
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form label-width="80px" size="small">
          <el-form-item label="菜单名称">
            <el-input v-model="form.menuName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径">
            <el-input v-model="form.path" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="页面路径">
            <el-input v-model="form.pagePath" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-select
              clearable
              v-model="form.icon"
              placeholder="请选择图标"
              style="width: 100%"
              class-name="fontSize18"
              align="center"
              label-class-name="fontSize12"
            >
              <el-option
                v-for="item in options"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
                <i :class="item.value" class="mr-5" /> {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
/* API */
import { getAllMenus, getIcon, saveMenu, delMenu } from '../api'
export default {
  name: 'Menus',
  data() {
    return {
      total: 0,
      tableData: [],
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      headerBg: 'headerBg',
      options: [],
      data: {
        menuName: '',
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  methods: {
    async load() {
      let res = await getAllMenus(this.data)
      if (res.code == '') {
        this.tableData = res.data.records
        this.total = res.data.total
      }
    },

    async save() {
      let res = await saveMenu(this.form)
      if (res.code == '') {
        // 获取成功
        this.$Message.success(res.message)
        this.load()
        this.dialogFormVisible = false
      }
      /*  this.request.post('/menu', this.form).then((res) => {
         if (res.code === '') {
           this.$Message.success(res.message)
           this.load()
         } else {
           this.$Message.error(res.message)
         }
       })
       this.dialogFormVisible = false */
    },

    async del(id) {
      let data = {}
      data.id = id
      let res = await delMenu(data)
      if (res.code == '') {
        // 获取成功
        this.$Message.success(res.message)
        this.load()
      }
      /* this.request.post('/menu/delById', data).then((res) => {
        if (res.code === '') {
          this.$Message.success(res.message)
          this.load()
        } else {
          this.$Message.error(res.message)
        }
      }) */
      this.load()
    },

    delBatch() {
      let that = this
      let ids = this.multipleSelection.map((v) => v.id)
      if (!ids.length) {
        this.$Message.warning('请选择要批量删除的菜单')
        return
      }
      this.$confirm('是否确认批量删除这些菜单吗', '提示', {
        iconClass: 'el-icon-question', //自定义图标样式
        confirmButtonText: '确认', //确认按钮文字更换
        cancelButtonText: '取消', //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: 'warning', //提示类型  success/info/warning/error
      })
        .then(async function () {
          let data = {}
          data.ids = ids
          //确认操作
          let res = await delMenu(data)
          if (res.code == '') {
            // 获取成功
            that.$Message.success(res.message)
            that.load()
          }
          /* that.request.post('/menu/del/batch', data).then((res) => {
            if (res.code === '') {
              that.$Message.success(res.message)
              that.load()
            } else {
              that.$Message.error(res.message)
            }
          }) */
        })
        .then((data) => {
          //取消操作
          console.log(data)
        })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async handleAdd(pid) {
      // 请求图标数据
      this.dialogFormVisible = true
      this.form = {}
      if (isNaN(pid)) {
        this.form.pid = ''
      } else {
        this.form.pid = pid
      }
      let res = await getIcon()
      if (res.code == '') {
        // 获取成功
        this.options = res.data
      }
    },

    async handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
      // 请求图标数据
      let res = await getIcon()
      if (res.code == '') {
        // 获取成功
        this.options = res.data
      }
    },

    async handleState(row) {
      let res = await saveMenu(row)
      if (res.code == '') {
        // 获取成功
        this.$Message.success(res.message)
        this.load()
      }
      /*  this.request.post('/menu', row).then((res) => {
         if (res.code === '') {
           this.$Message.success(res.message)
           this.load()
         } else {
           this.$Message.error(res.message)
         }
       }) */
    },
    // 重置搜索
    reset() {
      this.roleName = ''
      this.load()
    },
    // 搜索失焦重置
    blurSearch() {
      if (this.data.menuName == '') {
        this.reset()
      }
    },
    // 分页大小
    handleSizeChange(pageSize) {
      this.data.pageSize = pageSize
      this.load()
    },
    // 跳转页数
    handleCurrentChange(pageNum) {
      this.data.pageNum = pageNum
      this.load()
    },
    handleExcelImportSuccess() {
      let res = 1
      this.$Message.success(res.message)
      this.load()
    },
  },
  created() {
    this.load()
  },
}
</script>

<style scoped>
.headerBg {
  background: #eee !important;
}
.fontSize18 {
  font-size: 18px;
}
.fontSize12 {
  font-size: 12px;
}
</style>
