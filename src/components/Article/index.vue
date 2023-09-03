<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <!-- 列表 -->
        <el-tab-pane :label="detailData.list" name="list">
          <!-- 搜尋bar -->
          <div class="filter-container">
            <el-select
              v-model="listQuery.filter.status"
              :placeholder="$t('common.chooseStatus')"
              clearable
              class="filter-item select"
            >
              <el-option :label="$t('article.published')" :value="0" />
              <el-option :label="$t('article.removed')" :value="1" />
            </el-select>
            <el-date-picker
              v-model="dateInterval"
              type="daterange"
              :range-separator="$t('calendar.to')"
              :start-placeholder="$t('calendar.startDate')"
              :end-placeholder="$t('calendar.endDate')"
              :picker-options="calendarPastDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t('common.search') }}
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
              :label="$t('common.no')"
              align="center"
              width="60"
            >
              <template slot-scope="row">
                {{ row.$index + 1 + listQuery.page * listQuery.limit }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('article.photo')"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <img :src="row.photo" alt="" style="width: 120px; height: auto">
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('article.title')"
              prop="title"
              align="center"
              width="450"
            />
            <el-table-column
              :label="$t('article.publish_date')"
              prop="publish_date"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <span>{{ row.publish_date | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('article.admin_id')"
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
                  $t("article.published")
                }}</el-tag>
                <el-tag v-if="row.status === 1" type="danger">{{
                  $t("article.removed")
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
          <el-dialog :title="$t('common.edit')" :visible.sync="editVisible" width="1100px">
            <Form
              :form-data="editFormData"
              @emitData="confirmEdit"
              @cancel="editVisible = false"
            />
          </el-dialog>
        </el-tab-pane>

        <!-- 新增 -->
        <el-tab-pane :label="detailData.add" name="add">
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
import { calendarPastDatePicker } from '@/utils/calendarPick'

export default {
  components: {
    Pagination,
    Form
  },
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      list: null,
      tabName: 'list',
      calendarPastDatePicker,
      dateInterval: [],
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
      currentPage: 0,
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        publish_date: { preset: '' },
        admin_id: { preset: '' },
        title: {
          type: 'long-input',
          label: this.$t('article.title'),
          preset: ''
        },
        photo: {
          type: 'photo',
          label: this.$t('article.photo'),
          preset: ''
        },
        status: {
          type: 'select',
          label: this.$t('common.status'),
          preset: 0,
          options: [
            { label: this.$t('article.published'), value: 0 },
            { label: this.$t('article.removed'), value: 1 }
          ]
        },
        to_top: {},
        tag: {
          type: 'tag',
          label: this.$t('article.tag'),
          preset: []
        },
        content: {
          type: 'tinymce',
          label: this.$t('article.content'),
          preset: ''
        }
      },
      // 新增
      addFormData: {
        publish_date: { preset: '' },
        admin_id: { preset: '' },
        title: {
          type: 'long-input',
          label: this.$t('article.title'),
          preset: ''
        },
        photo: {
          type: 'photo',
          label: this.$t('article.photo'),
          preset: ''
        },
        status: {
          type: 'select',
          label: this.$t('common.status'),
          preset: 0,
          options: [
            { label: this.$t('article.published'), value: 0 },
            { label: this.$t('article.removed'), value: 1 }
          ]
        },
        to_top: {},
        tag: {
          type: 'tag',
          label: this.$t('article.tag'),
          preset: []
        },
        content: {
          type: 'tinymce',
          label: this.$t('article.content'),
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
    this.checkType()
    await checkUserList(this.userList)
    this.checkToTop()
    this.getList()
  },
  methods: {
    checkType() {
      // 判斷type
      this.listQuery.filter = Number.isInteger(this.detailData.type)
        ? {
          status: undefined,
          begin_date: '',
          end_date: '',
          type: this.detailData.type
        }
        : {
          status: undefined,
          begin_date: '',
          end_date: ''
        }
      if (Number.isInteger(this.detailData.type)) {
        this.editData.type = { preset: this.detailData.type }
        this.addFormData.type = { preset: this.detailData.type }
      }
    },
    checkToTop() {
      // 最高權限才能編輯to_top
      this.editData.to_top = !this.user.permit
        ? {
          type: 'select',
          label: this.$t('article.to_top'),
          preset: false,
          options: [
            { label: '置頂', value: true },
            { label: '取消置頂', value: false }
          ]
        }
        : {
          preset: false
        }
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
      if (this.dateInterval === null || this.dateInterval.length === 0) {
        this.listQuery.filter.begin_date = ''
        this.listQuery.filter.end_date = ''
      } else {
        [this.listQuery.filter.begin_date, this.listQuery.filter.end_date] = this.dateInterval
      }
      callApi(
        this.detailData.path,
        'articleList',
        removeNullAndEmptyString(this.listQuery)
      ).then((res) => {
        this.list = res.list
        this.total = res.total
      })
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    // 編輯
    handleEdit(row) {
      callApi(this.detailData.path, 'articleList', {
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
        this.detailData.path,
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
          message: 'article.inputContent'
        },
        {
          field: 'photo',
          condition: !form.photo,
          message: 'article.inputPhoto'
        },
        {
          field: 'title',
          condition: !form.title,
          message: 'article.inputTitle'
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
      if (Number.isInteger(this.detailData.type)) {
        data.type = this.detailData.type
      }
      data.publish_date = this.makePublishTime()
      data.admin_id = this.user._id
      if (allStore.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi(this.detailData.path, 'addArticle', data).then(() => {
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
  width: 1000px;
  padding: 20px;
}
</style>
