<template>
  <div style="margin: -10px 0">
    <el-card>
      <!-- 搜索 -->
      <el-input
        placeholder="搜索字典"
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
        >添加字典<i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 添加字典弹窗 -->
      <el-dialog
        title="添加字典"
        :visible.sync="centerDialogVisibleAdd"
        width="430px"
        center
      >
        <!-- 添加字典表单 -->
        <el-form
          :model="newDict"
          label-width="65px"
          ref="newDict"
          style="margin-left: -10px"
        >
          <el-form-item label="名字" prop="name">
            <el-input v-model="newDict.name"></el-input>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="newDict.value"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="newDict.type"
              placeholder="请选择类型"
              style="width: 325px"
            >
              <el-option
                v-for="item in dictTypes"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('newDict')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 添加字典类型 -->
      <el-button
        type="primary"
        style="margin: 20px 0 0 20px"
        @click="centerDialogVisibleAddType = true"
        >添加字典类型<i class="el-icon-circle-plus-outline"></i
      ></el-button>
      <!-- 添加字典类型弹窗 -->
      <el-dialog
        title="添加字典类型"
        :visible.sync="centerDialogVisibleAddType"
        width="430px"
        center
      >
        <!-- 添加字典类型表单 -->
        <el-form
          :model="newDictType"
          label-width="65px"
          ref="newDictType"
          style="margin-left: -10px"
        >
          <el-form-item label="名字" prop="name">
            <el-input v-model="newDictType.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="newDictType.value"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="newDictType.type" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleAddType = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="submitFormType">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除字典 -->
      <el-popover
        placement="top"
        width="200"
        trigger="manual"
        content="请勾选需要删除的字典"
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
        <span>你确定要删除勾选的字典吗?</span>
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
          prop="value"
          label="预览"
          align="center"
          :resizable="false"
        >
          <template slot-scope="scope">
            <i :class="scope.row.value"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名字"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="value"
          label="值"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
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
              @click="handleEditDict(scope.row)"
              >编辑信息<i class="el-icon-edit"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑字典弹窗 -->
      <el-dialog
        title="编辑字典信息"
        :visible.sync="centerDialogVisibleEdit"
        width="430px"
        center
      >
        <!-- 编辑字典表单 -->
        <el-form
          :model="editDict"
          label-width="65px"
          ref="editDict"
          style="margin-left: -10px"
        >
          <el-form-item label="id" prop="id">
            <el-input v-model="editDict.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="name">
            <el-input v-model="editDict.name"></el-input>
          </el-form-item>
          <el-form-item label="值" prop="value">
            <el-input v-model="editDict.value"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="editDict.type"
              placeholder="请选择字典类型"
              style="width: 325px"
            >
              <el-option
                v-for="item in dictTypes"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editDict')"
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
/* 获取字典列表接口 */
import { dictGetAll, dictGetType, editOneDict, addOneDict, delDict, addDictType } from '../api'
/* 下载文件 */

export default {
  name: 'Dictionaries',
  data() {
    return {
      // 添加字典类型表单
      newDictType: { name: '字典类型', type: 'DICT_TYPE' },
      // 字典类型
      dictTypes: [],
      // 添加字典类型弹窗
      centerDialogVisibleAddType: false,
      // 增加字典弹窗
      centerDialogVisibleAdd: false,
      // 编辑字典弹窗
      centerDialogVisibleEdit: false,
      // 删除字典
      dialogVisibleDel: false,
      delPoppover: false,
      // 勾选的字典
      ids: [],
      // 表格数据
      total: 0,
      // 新增字典
      newDict: {},
      // 编辑字典
      editDict: {},
      // 表格数据
      tableData: [],
      // 查询单条数据
      query: '',
      // 列表参数
      queryInfo: {
        dictName: '',
        dictType: '',
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
    'centerDialogVisibleEdit'(newValue) {
      if (!newValue) {
        // 关闭编辑就重新获取表格
        this.dictTypes = []
        this.getData()
      }
    }
  },
  created() {
    /* 初始化获取数据 */
    this.getData()
  },
  methods: {
    // 点击编辑字典
    async handleEditDict(row) {
      this.editDict = row
      this.centerDialogVisibleEdit = true
    },
    // 删除字典按钮
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
    // 删除字典请求
    async del() {
      // 删除字典
      let res = await delDict(this.ids)
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
    // 提交字典类型表单
    async submitFormType() {
      let res = await addDictType(this.newDictType)
      if (res.code == '') {
        this.$Message.success(res.message)
        this.centerDialogVisibleAddType = false
        this.getData()
      }
    },
    // 提交表单  包含编辑和新增
    async submitForm(val) {
      if (val == 'editDict') {
        // 编辑字典
        let res = await editOneDict(this.editDict)
        if (res.code == '') {
          // 修改成功
          this.$Message.success(res.message)
          this.centerDialogVisibleEdit = false
        }
      } else {
        // 新增字典
        let res = await addOneDict(this.newDict)
        if (res.code == '') {
          // 新增成功
          this.$Message.success(res.message)
          this.newDict == ''
          this.centerDialogVisibleAdd = false
          this.getData()
        }
      }
    },
    /* // 筛选专业
    filterChange(obj) {
      console.log(obj);
      if (obj.filterTag.length == 0) {
        // 重置重新获取
        this.queryInfo.dictType = ''
        this.getData()
      } else {
        // 筛选 遗留bug，后端应该接收数组
        obj.filterTag.forEach(item => {
          this.queryInfo.dictType = item
        })
        this.getData()
      }
    }, */
    // 查询单条
    find() {
      this.queryInfo.dictName = this.query.trim()
      this.getData()
    },
    // 清空还原
    clearSearch() {
      this.queryInfo.dictName = ''
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
      let res = await dictGetAll(this.queryInfo)
      let resType = await dictGetType()
      if (res.code == '' && resType.code == '') {
        this.tableData = res.data.records
        this.total = res.data.total
        resType.data.forEach(item => {
          this.dictTypes.push({ text: item, value: item })
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
