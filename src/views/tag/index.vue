<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('tag.list')" name="list">
          <el-table
            :data="list"
            border
            fit
            highlight-current-row
            class="table-list"
          >
            <el-table-column
              :label="$t('productionInformation.no')"
              align="center"
              width="60"
            >
              <template slot-scope="row">
                {{ row.$index + 1 + listQuery.page * listQuery.limit }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('tag.tag')"
              prop="tag"
              align="center"
              width="450"
            />
            <el-table-column
              :label="$t('common.action')"
              align="center"
              width="120"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="handleEdit(row)">
                  {{ $t("common.edit") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- page -->
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="listQuery.limit"
            style="text-align: center"
            :page-sizes="[20, 50, 100]"
            @pagination="getList"
          />

          <!-- 編輯 -->
          <el-dialog title="編輯" :visible.sync="editVisible">
            <Form
              :form-data="editFormData"
              @emitData="confirmEdit"
              @cancel="editVisible = false"
            />
          </el-dialog>
        </el-tab-pane>

        <el-tab-pane :label="$t('tag.add')" name="add">
          <Form
            class="form-container"
            :form-data="addFormData"
            :confirm-text="$t('lightbox.add')"
            @cancel="clearAdd"
            @emitData="confirmAdd"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { callApi } from '@/api/api'
import Form from '@/components/Form/index'
import { removeNullAndEmptyString } from '@/utils/index.js'
import allStore from '@/store'

export default {
  components: {
    Pagination,
    Form
  },
  data() {
    return {
      total: 0,
      list: null,
      tabName: 'list',
      currentPage: 0,
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          tag: ''
        }
      },
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        tag: {
          type: 'input',
          label: this.$t('tag.tag'),
          preset: ''
        }
      },
      // 新增
      addFormData: {
        _id: { preset: '' },
        tag: {
          type: 'input',
          label: this.$t('tag.tag'),
          preset: ''
        }
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      callApi('tag', 'list', removeNullAndEmptyString(this.listQuery)).then(
        (res) => {
          // console.log(this.list);
          this.list = res.list
          this.total = res.total
          this.dateInterval = []
        }
      )
    },
    handleEdit(row) {
      console.log(row)
      this.editVisible = true
      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })
      this.editFormData = this.editData
    },
    confirmEdit(data) {
      if (allStore.state.settings.showLog) {
        console.log(data)
      }

      callApi('tag', 'edit', removeNullAndEmptyString(data)).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.getList()
        this.editVisible = false
      })
    },
    // 新增
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key].preset = ''
      })
    },
    formValidate(form) {
      const validationRules = [
        {
          field: 'tag',
          condition: !form.tag,
          message: 'tag.inputTag'
        }
      ]
      for (const rule of validationRules) {
        if (rule.condition) {
          alert(this.$t(rule.message))
          return false
        }
      }
      return true
    },
    confirmAdd(data) {
      if (allStore.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi('tag', 'add', removeNullAndEmptyString(data)).then(() => {
          alert(this.$t('alert.addSuccess'))
          this.clearAdd()
          this.getList()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  .select {
    width: 150px;
    margin-right: 10px;
    margin-bottom: 1px;
  }
  .input {
    width: 150px;
    margin-right: 10px;
  }
  .el-range-editor {
    margin-right: 10px;
  }
  .el-button {
    margin-bottom: 1px;
  }
}
.table-list {
  width: fit-content;
}
.form-container {
  display: inline-block;
  border: 1px dashed lightgray;
  width: fit-content;
  padding: 20px 30px;
  border-radius: 5px;
}
</style>
