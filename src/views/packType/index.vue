<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('packType.list')" name="pack_list">
          <!--搜尋Bar-->
          <div class="filter-container">
            <el-input
              v-model="listQuery.filter.name"
              :placeholder="$t('packType.inputName')"
              clearable
              type="text"
              class="input"
            />
            <el-select
              v-model="listQuery.filter.status"
              :placeholder="$t('packType.chooseStatus')"
              clearable
              class="filter-item select"
            >
              <el-option :label="$t('packType.published')" :value="0" />
              <el-option :label="$t('packType.removed')" :value="1" />
            </el-select>
            <el-button
              :loading="loading"
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t("common.search") }}
            </el-button>
          </div>

          <!-- 表格 -->
          <el-table
            :loading="loading"
            :data="list"
            border
            fit
            highlight-current-row
            class="table-list"
          >
            <el-table-column :label="$t('common.no')" align="center" width="60">
              <template slot-scope="row">
                {{ row.$index + 1 + listQuery.page * listQuery.limit }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('packType.name')"
              prop="name"
              align="center"
              width="350"
            />
            <el-table-column
              :label="$t('packType.packType')"
              prop="packType"
              align="center"
              width="100"
            />
            <el-table-column
              :label="$t('packType.mainType')"
              prop="mainType"
              align="center"
              width="100"
            >
              <template slot-scope="{ row }">
                <span>{{ getPackTypeLabel(row.mainType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.status')"
              prop="status"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <el-tag v-if="row.status === 0" type="success">{{
                  $t("packType.published")
                }}</el-tag>
                <el-tag v-if="row.status === 1" type="danger">{{
                  $t("packType.removed")
                }}</el-tag>
              </template>
            </el-table-column>
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

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="listQuery.limit"
            style="text-align: center"
            :page-sizes="[20, 50, 100]"
            @pagination="getList"
          />
        </el-tab-pane>

        <!-- 新增 -->
        <el-tab-pane :label="$t('packType.add')" name="add_pack">
          <PackTypeAdd @addCompleted="addCompleted" />
        </el-tab-pane>
      </el-tabs>

      <!-- 編輯 -->
      <el-dialog
        :title="$t('permits.card_edit')"
        class="edit-dialog"
        :visible.sync="editVisible"
      >
        <Form
          :form-data="editFormData"
          @emitData="confirmEdit"
          @cancel="editVisible = false"
        />
      </el-dialog>
    </template>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Form from '@/components/Form/index'
import PackTypeAdd from './packTypeAdd'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'
import { packMainTypeList } from '@/config/main'
import store from '@/store'
import { setPackTypeList } from '@/utils/packTypeList'

export default {
  components: {
    Pagination,
    Form,
    PackTypeAdd
  },
  data() {
    return {
      total: 0,
      list: null,
      productInfoArr: [],
      tabName: 'pack_list',
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          name: '',
          status: undefined
        }
      },
      currentPage: 0,
      loading: false,
      actionLoading: false,
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        name: {
          type: 'long-input',
          label: this.$t('packType.name'),
          preset: ''
        },
        packType: {
          type: 'input',
          label: this.$t('packType.packType'),
          preset: ''
        },
        mainType: {
          type: 'select',
          label: this.$t('packType.mainType'),
          preset: '',
          options: packMainTypeList
        },
        status: {
          type: 'select',
          label: this.$t('packType.mainType'),
          preset: '',
          options: [
            { label: this.$t('packType.published'), value: 0 },
            { label: this.$t('packType.removed'), value: 1 }
          ]
        }
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      if (this.listQuery.filter.status === '') {
        this.listQuery.filter.status = undefined
      }
      this.listQuery.page = this.currentPage - 1
      callApi(
        'packType',
        'list',
        removeNullAndEmptyString(this.listQuery)
      ).then((res) => {
        this.list = res.list
        this.total = res.total

        // 將最新的packType存入storage
        for (let i = 0; i < this.list.length; i++) {
          this.productInfoArr.push({
            label: this.list[i].name,
            value: this.list[i].packType
          })
        }
        this.productInfoArr = this.productInfoArr.sort((a, b) => {
          return a.label > b.label ? 1 : -1
        })
        setPackTypeList(this.productInfoArr)
        this.loading = false
      })
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    // 編輯
    getPackTypeLabel(value) {
      const matchedItem = packMainTypeList.find((item) => item.value === value)
      return matchedItem ? matchedItem.label : '-'
    },
    handleEdit(row) {
      this.editVisible = true

      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })
      this.editFormData = this.editData
    },
    async confirmEdit(data) {
      if (store.state.settings.showLog) {
        console.log(data)
      }
      if (this.actionLoading) {
        return
      }
      this.actionLoading = true
      try {
        if (this.formValidate(data)) {
          await callApi('packType', 'edit', data)
          alert(this.$t('alert.editSuccess'))
          this.getList()
          this.editVisible = false
        }
      } finally {
        this.actionLoading = false
      }
    },
    // 表單驗證
    formValidate(form) {
      const validationRules = [
        { field: 'name', condition: !form.name, message: 'packType.inputId' },
        {
          field: 'packType',
          condition: !form.packType,
          message: 'packType.inputName'
        },
        {
          field: 'mainType',
          condition: !form.mainType,
          message: 'packType.mainType'
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
    // 新增
    addCompleted() {
      this.getList()
      this.tabName = 'pack_list'
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  & .input {
    width: 150px;
    margin-right: 10px;
    vertical-align: top;
  }
  & .select {
    width: 150px;
    margin-right: 10px;
  }
}
.table-list {
  width: fit-content;
}
</style>
