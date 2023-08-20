<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('memberManage.list')" name="admin_list">
          <!-- 搜尋Bar -->
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
            <el-select
              v-model="listQuery.filter.type"
              :placeholder="$t('memberManage.chooseType')"
              clearable
              class="filter-item select"
            >
              <el-option :label="$t('memberManage.manager')" :value="0" />
              <el-option :label="$t('memberManage.blogAdminUser')" :value="1" />
              <el-option :label="$t('memberManage.blogOnlyUser')" :value="2" />
            </el-select>
            <el-input
              v-model="listQuery.filter.name"
              :placeholder="$t('memberManage.inputName')"
              clearable
              type="text"
              class="filter-item input"
            />
            <el-input
              v-model="listQuery.filter.account"
              :placeholder="$t('memberManage.inputAccount')"
              clearable
              type="text"
              class="filter-item input"
            />
            <el-button
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
              :label="$t('memberManage.id')"
              prop="_id"
              align="center"
              width="130"
            />
            <el-table-column
              :label="$t('memberManage.account')"
              prop="account"
              align="center"
              width="160"
            />
            <el-table-column
              :label="$t('memberManage.type')"
              prop="type"
              align="center"
              width="130"
            >
              <template slot-scope="{ row }">
                <el-tag v-if="row.type === 0" type="info">{{
                  $t("memberManage.manager")
                }}</el-tag>
                <el-tag v-if="row.type === 1">{{
                  $t("memberManage.blogAdminUser")
                }}</el-tag>
                <el-tag v-if="row.type === 2" type="warning">{{
                  $t("memberManage.blogOnlyUser")
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('memberManage.name')"
              prop="name"
              align="center"
              width="150"
            />
            <el-table-column
              :label="$t('memberManage.createDate')"
              prop="create_date"
              align="center"
              width="140"
            >
              <template slot-scope="{ row }">
                <span>{{
                  new Date(row.create_date).toLocaleDateString()
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

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="listQuery.limit"
            style="text-align: center"
            :page-sizes="[20, 50, 100]"
            @pagination="getList"
          />

          <!-- 編輯燈箱 start -->
          <el-dialog
            :title="$t('common.edit')"
            :visible.sync="editLightBoxVisible"
          >
            <el-form
              ref="dataForm"
              label-position="left"
              label-width="120px"
              style="width: 350px; margin-left: 50px"
            >
              <el-form-item :label="'*' + $t('memberManage.type')">
                <el-select
                  v-model="edit_type"
                  :placeholder="$t('memberManage.chooseType')"
                  clearable
                >
                  <el-option :label="$t('memberManage.manager')" :value="0" />
                  <el-option
                    :label="$t('memberManage.blogAdminUser')"
                    :value="1"
                  />
                  <el-option
                    :label="$t('memberManage.blogOnlyUser')"
                    :value="2"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="'*' + $t('common.status')">
                <el-select
                  v-model="edit_status"
                  :placeholder="$t('memberManage.chooseStatus')"
                  clearable
                >
                  <el-option :label="$t('memberManage.normal')" :value="0" />
                  <el-option :label="$t('memberManage.blocked')" :value="1" />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editLightBoxVisible = false">
                {{ $t("lightbox.cancel") }}
              </el-button>
              <el-button type="primary" @click="updateAdmin">
                {{ $t("lightbox.confirm") }}
              </el-button>
            </div>
          </el-dialog>
          <!-- 編輯燈箱 end -->
        </el-tab-pane>

        <!-- 新增帳號 -->
        <el-tab-pane :label="$t('memberManage.addAccount')" name="add_account">
          <MemberAdd @addCompleted="addCompleted" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import MemberAdd from './memberAdd'
import Pagination from '@/components/Pagination'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'

export default {
  components: {
    MemberAdd,
    Pagination
  },
  data() {
    return {
      total: 0,
      list: null,
      tabName: 'admin_list',
      listQuery: {
        // token: getToken(),
        page: 0,
        limit: 20,
        filter: {
          type: undefined,
          status: undefined,
          name: '',
          account: '',
          begin_date: '',
          end_date: ''
        }
      },
      currentPage: 0,
      // 編輯會員
      editLightBoxVisible: false,
      edit_id: undefined,
      edit_status: undefined,
      edit_type: undefined
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.listQuery.filter.status === '') {
        this.listQuery.filter.status = undefined
      }
      if (this.listQuery.filter.type === '') {
        this.listQuery.filter.type = undefined
      }
      this.listQuery.page = this.currentPage - 1
      callApi('admin', 'list', removeNullAndEmptyString(this.listQuery)).then(
        (res) => {
          this.list = res.list
          this.total = res.total
        }
      )
    },
    handleFilter() {
      console.log(this.listQuery.filter)
      this.currentPage = 1
      this.getList()
    },
    // 編輯會員
    handleEdit(list) {
      this.editLightBoxVisible = true
      this.edit_id = list._id
      this.edit_type = list.type
      this.edit_status = list.status
    },
    updateAdmin() {
      const data = {
        // 'token': getToken(),
        _id: this.edit_id,
        type: this.edit_type,
        status: this.edit_status
      }
      callApi('admin', 'edit', data).then((res) => {
        alert(this.$t('alert.editSuccess'))
        this.editLightBoxVisible = false
        this.getList()
      })
    },
    // 新增會員
    addCompleted() {
      this.getList()
      this.tabName = 'admin_list'
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  .select {
    width: 150px;
    margin-right: 10px;
  }
  .input {
    width: 150px;
    margin-right: 10px;
  }
}
.table-list {
  width: fit-content;
}
</style>
