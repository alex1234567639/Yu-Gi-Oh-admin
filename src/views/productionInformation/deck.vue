<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane
          :label="$t('productionInformation.deckList')"
          name="deck_list"
        >
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
              :label="$t('productionInformation.id')"
              prop="_id"
              align="center"
              width="130"
            />
            <el-table-column
              :label="$t('productionInformation.title')"
              prop="title"
              align="center"
              width="500"
            />
            <el-table-column
              :label="$t('productionInformation.publish_date')"
              prop="publish_date"
              align="center"
              width="140"
            >
              <template slot-scope="{ row }">
                <span>{{
                  new Date(row.publish_date).toLocaleDateString()
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('productionInformation.status')"
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
              :label="$t('productionInformation.action')"
              align="center"
              width="120"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="handleEdit(row)">
                  {{ $t("productionInformation.edit") }}
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
        <el-tab-pane
          :label="$t('productionInformation.deckAdd')"
          name="deck_add"
        />
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
import { checkTagList } from '@/api/article'

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
      tabName: 'deck_list',
      currentPage: 0,
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          status: undefined,
          begin_date: '',
          end_date: '',
          type: 3
        }
      },
      dateInterval: [],
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        publish_date: { preset: '' },
        type: { preset: '' },
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
          label: this.$t('productionInformation.status'),
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
    tagList() {
      return store.state.tagList
    },
    user() {
      return userStore.state.accountInfo
    }
  },
  mounted() {
    this.getList()
    checkTagList(this.tagList)
  },
  methods: {
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
        'productInformation',
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
      this.editVisible = true
      this.editData.tag.preset = this.tagList.map((el) => ({
        _id: el._id,
        tag: el.tag
      }))

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

      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })
      this.editFormData = this.editData
    },
    confirmEdit(data) {
      data.publish_date = `${new Date()
        .toLocaleDateString()
        .replaceAll('/', '-')} ${new Date().toTimeString().split(' ')[0]}`
      if (allStore.state.settings.showLog) {
        console.log(data)
      }

      callApi(
        'productInformation',
        'editArticle',
        removeNullAndEmptyString(data)
      ).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.getList()
        this.editVisible = false
      })
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
