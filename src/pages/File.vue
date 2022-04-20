<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索文件名"
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

      <!-- 删除文件 -->
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的文件"
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
        <span>你确定要删除勾选的文件吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 文件上传下载 -->
      <el-upload
        :action="this.$store.state.allip + '/file/upload'"
        style="display: inline-block"
        class="ml-5"
        :show-file-list="false"
        :on-success="handleExcelImportSuccess"
        :headers="upLoadHeader"
        :data="upLoadData"
      >
        <el-button type="primary" style="margin: 20px 0 0 20px"
          >文件上传<i class="el-icon-top"></i
        ></el-button>
      </el-upload>
      <el-dialog
        title="警告"
        :visible.sync="dialogVisibleImport"
        width="30%"
        center
      >
        <span>{{ importError }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleImport = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleImport = false"
            >确 定</el-button
          >
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
          prop="fileName"
          label="文件名"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="fileSize"
          label="文件大小/kb"
          sortable
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="fileType"
          label="文件类型"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="fileUrl"
          label="文件路径"
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="md5"
          label="MD5"
          align="center"
          column-key="filterTag"
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
            <el-button type="text" size="small" @click="exp(scope.row)"
              >下载文件<i class="el-icon-bottom"></i
            ></el-button>
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
import { getFile, delFile, downloadFile } from '../api'
/* 下载文件 */

export default {
  name: 'File',
  data() {
    return {
      // 导入失败文字
      importError: '',
      // 导入失败弹窗
      dialogVisibleImport: false,
      // 删除学生
      dialogVisibleDel: false,
      delPoppover: false,
      // 文件上传数据
      upLoadData: { roleId: 5 },
      // 文件上传token
      upLoadHeader: {},
      // 勾选的学生
      ids: [],
      // 表格数据
      total: 0,
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        // 文件名
        fileName: '',
        // 当前页
        pageNum: 1,
        // 一页展示多少条
        pageSize: 10,
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
  mounted() {
    // 获取token
    let Mytoken = JSON.parse(localStorage.getItem('user')).token
    this.upLoadHeader = { token: Mytoken }
  },
  methods: {
    // 下载文件
    async exp(row) {
      let res = await downloadFile(row.fileUrl)
      const href = URL.createObjectURL(
        new Blob([res], {
          type: 'application/octet-stream',
        })
      )
      // 下载文件
      const link = document.createElement('a')
      link.download = `${row.fileName}`
      link.href = href
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href) //释放url
      document.body.removeChild(link) //释放标签
      this.$Message.success('下载成功!')
    },
    // 导入成功
    handleExcelImportSuccess(res) {
      console.log(res);
      if (res.code) {
        this.dialogVisibleImport = true
        this.importError = res.message
      } else {
        this.$Message.success('文件上传成功')
        this.getData()
      }
    },
    // 批量删除按钮
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
    // 删除文件请求
    async del() {
      let data = {
        fileName: "",
        id: 0,
        ids: []
      }
      data.ids = this.ids
      // 删除文件
      let res = await delFile(data)
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
    // 筛选专业
    filterChange(obj) {
      this.queryInfo.major = obj.filterTag
      this.getData()
    },
    // 查询单条
    find() {
      this.queryInfo.fileName = this.query.trim()
      this.getData()
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.fileName = ''
      this.getData()
    },
    // 手动删除search
    blurSearch() {
      if (this.query == '') {
        this.clearSearch()
      }
    },
    /* // 点击编辑行
    async handleClick(row) {
      this.editStudent = row
      // 请求年级 学院
      try {
        let res = await getAllGrade()
        let resDep = await getAllDept()
        if (res.code && resDep.code) {
          // token过期
          if (res.code == '1001' || res.code == '1002' || resDep.code == '1001' || resDep.code == '1002') {
            this.tokenLost()
          } else {
            this.$Message.error(res.message)
            this.$Message.error(resDep.message)
          }
        } else {
          // 获取年级后渲染到表单里
          this.allGrade = res.data
          // 获取全部学院渲染到表单里
          this.allDepartment = resDep.data
          resDep.data.forEach(item => {
            if (this.editStudent.department == item.organizationName) {
              this.getSomeMajors(item.id)
              this.currentDept = item.id
            }
          })
          this.centerDialogVisibleEdit = true
        }
      } catch (error) {
        this.$Message.error(error)
      }
    }, */

    // 获取数据接口
    async getData() {
      //let myMajor = JSON.parse(localStorage.getItem('user')).major
      //let resMyDept = await getMajorsByDet()
      let res = await getFile(this.queryInfo)
      if (res.code == '') {
        this.tableData = res.data.records
        this.total = res.data.total
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
