<template>
  <div>
    <el-card>
      <el-input
        placeholder="搜索学院"
        v-model="data.organizationName"
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
              v-if="scope.row.checkName"
              @click="checkClass(scope.row.id)"
              >查看班级 <i class="el-icon-view"></i
            ></el-button>
            <!-- 其他操作的按钮 -->
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
              :disabled="scope.row.disAdd"
              v-if="scope.row.fr"
              >{{ scope.row.fr }}<i class="el-icon-plus"></i
            ></el-button>
            <el-button
              type="success"
              @click="handleEdit(scope.row)"
              size="mini"
              style="margin-right: 10px"
              v-if="scope.row.se"
              :disabled="scope.row.disEdit"
              >{{ scope.row.se }} <i class="el-icon-edit"></i
            ></el-button>
            <el-popconfirm
              class="ml-5"
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗?"
              @confirm="del(scope.row.id)"
              v-if="scope.row.th"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                v-if="scope.row.th"
                :disabled="scope.row.disDel"
                >{{ scope.row.th }} <i class="el-icon-delete"></i
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

      <!-- 编辑 -->
      <el-dialog
        :title="formText.title"
        center
        :visible.sync="dialogFormEditVisible"
        width="30%"
      >
        <el-form label-width="80px" size="small">
          <el-form-item :label="formText.name">
            <el-input v-model="editName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSave">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
/* API */
import { schoolTable, saveMenu, getMajorsByDet, getAllGrade, getAllClass, addNewOrg, delById, editById } from '../api'
export default {
  name: 'School',
  data() {
    return {
      maps: new Map(),
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

      },
      editName: '',
      dialogFormEditVisible: false,
      editId: 0,
    }
  },
  methods: {
    // 查看班级
    checkClass(id) {
      console.log(id)
    },
    // 懒加载数据
    async loadSomeData(tree, treeNode, resolve) {
      this.maps.set(tree.id, { tree, treeNode, resolve })
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
            // 按钮文字
            res.data.forEach(item => {
              Object.assign(item, { fr: '新增年级' })
              Object.assign(item, { disAdd: true })
              Object.assign(item, { se: '编辑专业' })
              Object.assign(item, { th: '删除专业' })
            })
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
              res.data.forEach(item => {
                Object.assign(item, { fr: '新增班级' })
                Object.assign(item, { disEdit: true })
                Object.assign(item, { disDel: true })
                Object.assign(item, { se: '编辑年级' })
                Object.assign(item, { th: '删除年级' })
              })
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
              res.data.forEach(item => {
                Object.assign(item, { checkName: '查看班级' })
              })
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
          res.data.records.forEach(item => {
            Object.assign(item, { fr: '新增专业' })
            Object.assign(item, { se: '编辑学院' })
            Object.assign(item, { th: '删除学院' })
          })
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
          let flag = this.addForm.departmentId || this.addForm.majorId || this.addForm.gradeId
          if (flag == null) {
            this.load()
          } else {
            const { tree, treeNode, resolve } = this.maps.get(flag)
            this.loadSomeData(tree, treeNode, resolve)
          }
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
      try {
        let res = await delById(id)
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
        switch (this.formText.name) {
          case '专业名称':
            this.addForm.departmentId = pid.id
            break
          case '年级名称':
            this.addForm.majorId = pid.id
            break
          case '班级名称':
            this.addForm.gradeId = pid.id
            break
        }
      }
      this.dialogFormVisible = true
    },

    handleEdit(row) {
      this.formText.title = row.se
      this.formText.name = row.se.charAt(2) + row.se.charAt(3) + '名称'
      this.editId = row.id
      this.dialogFormEditVisible = true
    },
    async editSave() {
      try {
        let res = await editById(this.editId, this.editName)
        if (res.code) {
          if (res.code == '1001' || res.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.$Message.success(res.message)
          this.dialogFormEditVisible = false
          this.load()
        }
      } catch (error) {
        this.$Message.error(error)
      }
      this.editName = ''
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
      this.organizationName = ''
      this.load()
    },
    // 搜索失焦重置
    blurSearch() {
      if (this.data.organizationName == '') {
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
