<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('serialIntroduction.theme_list')" name="list">
          <!-- 搜尋bar -->
          <div class="filter-container">
            <el-select
              v-model="listQuery.filter.status"
              :placeholder="$t('memberManage.chooseStatus')"
              clearable
              class="filter-item select"
            >
              <el-option :label="$t('memberManage.normal')" :value="0" />
              <el-option :label="$t('memberManage.blocked')" :value="1" />
            </el-select>
            <el-date-picker
              v-model="dateInterval"
              class=""
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="结束日期"
            />
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t("memberManage.search") }}
            </el-button>
          </div>

          <!-- 表格 -->
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
              :label="$t('productionInformation.photo')"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <img
                  :src="row.photo"
                  alt=""
                  style="width: 120px; height: auto"
                >
                <!-- {{ row.admin_id }} -->
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('productionInformation.title')"
              prop="title"
              align="center"
              width="450"
            />
            <el-table-column
              :label="$t('productionInformation.publish_date')"
              prop="publish_date"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <span>{{
                  new Date(row.publish_date).toLocaleDateString()
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('productionInformation.admin_id')"
              prop="admin_id"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <span>{{
                  userList.find((el) => el._id === row.admin_id)
                    ? userList.find((el) => el._id === row.admin_id).name
                    : ""
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.status')"
              prop="status"
              align="center"
              width="100"
            >
              <template slot-scope="{ row }">
                <el-tag v-if="row.status === 0" type="success">{{
                  $t("memberManage.normal")
                }}</el-tag>
                <el-tag v-if="row.status === 1" type="danger">{{
                  $t("memberManage.blocked")
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

        <!-- 新增預組 -->
        <el-tab-pane :label="$t('serialIntroduction.theme_add')" name="add">
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
import allStore from '@/store'
import store from '@/store/modules/article'
import userStore from '@/store/modules/user'
import { checkUserList } from '@/api/article'

import { removeNullAndEmptyString } from '@/utils/index.js'

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
          status: undefined,
          begin_date: '',
          end_date: '',
          type: 0
        }
      },
      dateInterval: [],
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        publish_date: { preset: '' },
        type: { preset: 1 },
        admin_id: { preset: '' },
        title: {
          type: 'long-input',
          label: this.$t('productionInformation.title'),
          preset: ''
        },
        photo: {
          type: 'photo',
          label: this.$t('productionInformation.photo'),
          preset: ''
        },
        status: {
          type: 'select',
          label: this.$t('common.status'),
          preset: 0,
          options: [
            { label: '上架中', value: 0 },
            { label: '下架中', value: 1 }
          ]
        },
        to_top: {},
        tag: {
          type: 'tag',
          label: this.$t('productionInformation.tag'),
          preset: []
        },
        content: {
          type: 'tinymce',
          label: this.$t('productionInformation.content'),
          preset: ''
        }
      },
      // 新增
      addFormData: {
        _id: { preset: '' },
        publish_date: { preset: '' },
        type: { preset: 0 },
        admin_id: { preset: '' },
        title: {
          type: 'long-input',
          label: this.$t('productionInformation.title'),
          preset: ''
        },
        photo: {
          type: 'photo',
          label: this.$t('productionInformation.photo'),
          preset: ''
        },
        status: {
          type: 'select',
          label: this.$t('common.status'),
          preset: 0,
          options: [
            { label: '上架中', value: 0 },
            { label: '下架中', value: 1 }
          ]
        },
        to_top: {},
        tag: {
          type: 'tag',
          label: this.$t('productionInformation.tag'),
          preset: []
        },
        content: {
          type: 'tinymce',
          label: this.$t('productionInformation.content'),
          preset: ''
        }
      }
    }
  },
  computed: {
    user() {
      return userStore.state.accountInfo
    },
    userList() {
      return store.state.userList
    }
  },
  async mounted() {
    await checkUserList(this.userList)
    this.checkToTop()
    this.getList()
  },
  methods: {
    checkToTop() {
      // 最高權限才能編輯to_top
      this.editData.to_top = !this.user.permit
        ? {
          type: 'select',
          label: this.$t('productionInformation.to_top'),
          preset: false,
          options: [
            { label: '置頂', value: true },
            { label: '取消置頂', value: false }
          ]
        }
        : {
          preset: false
        }

      this.addFormData.to_top = JSON.parse(
        JSON.stringify(this.editData.to_top)
      )
    },
    makePublishTime() {
      return `${new Date().toLocaleDateString().replaceAll('/', '-')} ${
        new Date().toTimeString().split(' ')[0]
      }`
    },
    getList() {
      if (this.listQuery.filter.status === '') {
        this.listQuery.filter.status = undefined
      }

      // 轉換時間格式
      if (this.dateInterval.length) {
        this.listQuery.filter.begin_date = new Date(
          this.dateInterval[0]
        ).toLocaleDateString()
        this.listQuery.filter.end_date = new Date(
          this.dateInterval[1]
        ).toLocaleDateString()
      }
      callApi(
        'serialIntroduction',
        'articleList',
        removeNullAndEmptyString(this.listQuery)
      ).then((res) => {
        // console.log(this.list);
        this.list = res.list
        this.total = res.total
        this.dateInterval = []
      })
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    // 編輯
    handleEdit(row) {
      callApi('serialIntroduction', 'articleList', {
        page: 0,
        limit: 1,
        filter: {
          _id: row._id
        }
      }).then((res) => {
        this.editVisible = true

        // 帶入預設值
        Object.keys(this.editData).forEach((key) => {
          this.editData[key].preset = res.list[0][key]
        })
        this.editFormData = this.editData
      })
    },
    confirmEdit(data) {
      data.publish_date = this.makePublishTime()
      if (allStore.state.settings.showLog) {
        console.log(data)
      }

      callApi(
        'serialIntroduction',
        'editArticle',
        removeNullAndEmptyString(data)
      ).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.getList()
        this.editVisible = false
      })
    },
    // 新增
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key].preset =
          key === 'tag'
            ? []
            : key === 'status'
              ? 1
              : key === 'to_top'
                ? false
                : ''
      })
    },
    formValidate(form) {
      const validationRules = [
        {
          field: 'content',
          condition: !form.content,
          message: 'productionInformation.inputContent'
        },
        {
          field: 'photo',
          condition: !form.photo,
          message: 'productionInformation.inputPhoto'
        },
        {
          field: 'title',
          condition: !form.title,
          message: 'productionInformation.inputTitle'
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
      data.type = 0
      data.publish_date = this.makePublishTime()
      data.admin_id = this.user._id
      if (allStore.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi(
          'serialIntroduction',
          'addArticle',
          removeNullAndEmptyString(data)
        ).then(() => {
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
</style>
