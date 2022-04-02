<template>
  <div>
    <el-card>
      <el-input
        placeholder="搜索学院"
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

      <!-- 新增学院 -->
      <el-button
        type="primary"
        @click="handleAdd(false)"
        style="margin: 20px 0 0 20px"
        >新增一级学院 <i class="el-icon-circle-plus-outline"></i
      ></el-button>

      <!-- 批量删除学院 -->
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
        lazy
        :load="loadSomeData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          prop="organizationName"
          label="学院名称"
          align="left"
        />
        <el-table-column prop="studentCount" label="学生数量" align="center" />
        <el-table-column prop="teacherCount" label="老师数量" align="center" />
        <el-table-column prop="totalCount" label="总人数" align="center" />
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <!-- 班级跳转按钮 -->
            <el-button
              size="mini"
              type="primary"
              v-if="!btnName(scope.row.organizationName)"
              >查看班级 <i class="el-icon-view"></i
            ></el-button>
            <!-- 其他操作的按钮 -->
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
              v-if="btnName(scope.row.organizationName)"
              >{{ "新增" + btnName(scope.row.organizationName)[0]
              }}<i class="el-icon-plus"></i
            ></el-button>
            <el-button
              type="success"
              @click="handleEdit(scope.row)"
              size="mini"
              style="margin-right: 10px"
              v-if="btnName(scope.row.organizationName)"
              >{{ "编辑" + btnName(scope.row.organizationName)[1] }}
              <i class="el-icon-edit"></i
            ></el-button>
            <el-popconfirm
              class="ml-5"
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗?"
              @confirm="del(scope.row.id)"
              v-if="btnName(scope.row.organizationName)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                v-if="btnName(scope.row.organizationName)"
                >{{ "删除" + btnName(scope.row.organizationName)[2] }}
                <i class="el-icon-delete"></i
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

      <el-dialog
        :title="formText.title"
        center
        :visible.sync="dialogFormVisible"
        width="30%"
      >
        <el-form label-width="80px" size="small">
          <el-form-item :label="formText.name">
            <el-input
              v-model="addForm.organizationName"
              autocomplete="off"
            ></el-input>
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
import { schoolTable, saveMenu, delMenu, getMajorsByDet, getAllGrade, getAllClass, addNewOrg } from '../api'
export default {
  name: 'School',
  data() {
    return {
      total: 0,
      tableData: [],
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      headerBg: 'headerBg',
      formText: {
        title: '新增',
        name: ''
      },
      data: {
        organizationName: '',
        pageNum: 1,
        pageSize: 10,
      },
      addForm: {
        delFlag: "",
        departmentId: null,
        gradeId: null,
        id: null,
        majorId: null,
        organizationName: "",
        studentCount: null,
        teacherCount: null,
        totalCount: null
      }
    }
  },
  methods: {
    // 获取按钮文字
    btnName(res) {
      let btnNameObj = new Map([['院', '专业 '], ['系', '专业 '], ['业', '年级 '], ['学', '年级'], ['级', '班级 '], ['班', '']])
      if (btnNameObj.get(res.charAt(res.length - 1))) {
        if (res.charAt(res.length - 1) == '级') {
          return [btnNameObj.get(res.charAt(res.length - 1)), '年级', '年级']
        }
        return [btnNameObj.get(res.charAt(res.length - 1)), btnNameObj.get(res.charAt(res.length - 1)), btnNameObj.get(res.charAt(res.length - 1))]
      }
      // 班级
      return false
    },
    // 懒加载数据
    async loadSomeData(tree, treeNode, resolve) {
      if (tree.departmentId == null) {
        // 获取专业
        try {
          let res = await getMajorsByDet(tree.id)
          if (res.code) {
            if (res.code == '1001' || res.code == '1002') {
              this.tokenLost()
            } else {
              this.$Message.error(res.message)
            }
          } else {
            resolve(res.data)
          }
        } catch (error) {
          this.$Message.error(error)
        }
      } else {
        if (tree.organizationName.charAt(tree.organizationName.length - 1) != '级') {
          // 获取年级
          try {
            let res = await getAllGrade(tree.id)
            if (res.code) {
              if (res.code == '1001' || res.code == '1002') {
                this.tokenLost()
              } else {
                this.$Message.error(res.message)
              }
            } else {
              resolve(res.data)
            }
          } catch (error) {
            this.$Message.error(error)
          }
        } else {
          // 获取班级
          try {
            let res = await getAllClass(tree.id)
            if (res.code) {
              if (res.code == '1001' || res.code == '1002') {
                this.tokenLost()
              } else {
                this.$Message.error(res.message)
              }
            } else {
              resolve(res.data)
            }
          } catch (error) {
            this.$Message.error(error)
          }
        }
      }

    },
    // 处理token过期
    tokenLost() {
      this.$Message.error('您的登录信息已过期,请重新登录')
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      this.$router.push('/login')
    },
    async load() {
      try {
        let res = await schoolTable(this.data)
        if (res.code) {
          // token过期
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      } catch (error) {
        this.$Message.error(error)
      }
    },

    async save() {
      // 新增确定
      try {
        let res = await addNewOrg(this.addForm)
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.$Message.success(res.message)
          this.load()
        }
      } catch (error) {
        this.$Message.error(error)
      }
      this.dialogFormVisible = false
      this.addForm.organizationName = ''
      this.addForm.departmentId = null
      this.addForm.majorId = null
      this.addForm.gradeId = null
    },

    async del(id) {
      console.log('删除', id)
    },

    delBatch() {
      let that = this
      let ids = this.multipleSelection.map((v) => v.id)
      console.log(ids)
      if (!ids.length) {
        this.$Message.warning('请选择要批量删除的学院')
        return
      }
      this.$confirm('是否确认批量删除这些学院吗', '提示', {
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
          try {
            let res = await delMenu(data)
            if (res.code) {
              if (res.code == '1001' || res.code == '1002') {
                that.tokenLost()
              } else {
                that.$Message.error(res.message)
              }
            } else {
              // 获取成功
              that.$Message.success(res.message)
              that.load()
            }
          } catch (error) {
            that.$Message.error(error)
          }
        })
        .then((data) => {
          //取消操作
          console.log(data)
        })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 新增学院专业等
    async handleAdd(pid) {
      if (!pid) {
        // 新增学院
        this.formText.title = '新增学院'
        this.formText.name = '学院名称'
      } else {
        // 新增专业年级
        let obj = new Map([['院', '专业 '], ['系', '专业 '], ['业', '年级 '], ['学', '年级'], ['级', '班级 '], ['班', '']])
        let name = pid.organizationName
        this.formText.title = '新增' + obj.get(name.charAt(name.length - 1))
        this.formText.name = obj.get(name.charAt(name.length - 1)).trim() + '名称'
        let allname = ['专业', '年级', '班级']
        if (allname.includes(this.formText.title)) {
          this.addForm.departmentId = pid.id
        }
        console.log(pid)
      }
      this.dialogFormVisible = true
    },

    async handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
      console.log(row)
    },

    async handleState(row) {
      try {
        let res = await saveMenu(row)
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          // 获取成功
          this.$Message.success(res.message)
          this.load()
        }
      } catch (error) {
        this.$Message.error(error)
      }
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
