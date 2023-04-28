<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('memberManage.list')" name="admin_list">
          <!-- 搜尋Bar -->
          <div class="filter-container">
            <el-select v-model="listQuery.filter.status" :placeholder="$t('memberManage.chooseStatus')" clearable class="filter-item select">
              <el-option :label="$t('memberManage.normal')" :value="0" />
              <el-option :label="$t('memberManage.blocked')" :value="1" />
            </el-select>
            <el-select v-model="listQuery.filter.type" :placeholder="$t('memberManage.chooseType')" clearable class="filter-item select">
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
              v-model="listQuery.filter.name"
              :placeholder="$t('memberManage.inputAccount')"
              clearable
              type="text"
              class="filter-item input"
            />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              {{ $t('memberManage.search') }}
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
            <el-table-column :label="$t('memberManage.no')" align="center" width="60">
              <template slot-scope="row">
                {{ row.$index + 1 + listQuery.page*listQuery.limit }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('memberManage.id')" prop="id" align="center" width="130" />
            <el-table-column :label="$t('memberManage.account')" prop="account" align="center" width="160" />
            <el-table-column :label="$t('memberManage.type')" prop="type" align="center" width="130">
              <template slot-scope="{row}">
                <el-tag v-if="row.type === 0" type="info">{{ $t('memberManage.manager') }}</el-tag>
                <el-tag v-if="row.type === 1">{{ $t('memberManage.blogAdminUser') }}</el-tag>
                <el-tag v-if="row.type === 2" type="warning">{{ $t('memberManage.blogOnlyUser') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('memberManage.name')" prop="name" align="center" width="150" />
            <el-table-column :label="$t('memberManage.createDate')" prop="create_date" align="center" width="140">
              <template slot-scope="{row}">
                <span>{{ row.create_date | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('memberManage.status')" prop="status" align="center" width="100">
              <template slot-scope="{row}">
                <el-tag v-if="row.status === 0" type="success">{{ $t('memberManage.normal') }}</el-tag>
                <el-tag v-if="row.status === 1" type="danger">{{ $t('memberManage.blocked') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('memberManage.action')" align="center" width="120" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleEdit(row)">
                  {{ $t('memberManage.edit') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="currentPage"
            :limit.sync="listQuery.limit"
            style="text-align:center"
            :page-sizes="[20,50,100]"
            @pagination="getList"
          />

          <!-- 編輯燈箱 start -->
          <el-dialog :title="$t('memberManage.edit')" :visible.sync="editLightBoxVisible">
            <el-form ref="dataForm" label-position="left" label-width="120px" style="width:350px; margin-left:50px;">
              <el-form-item :label="'*' + $t('memberManage.type')">
                <el-select v-model="edit_type" :placeholder="$t('memberManage.chooseType')" clearable>
                  <el-option :label="$t('memberManage.manager')" :value="0" />
                  <el-option :label="$t('memberManage.blogAdminUser')" :value="1" />
                  <el-option :label="$t('memberManage.blogOnlyUser')" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item :label="'*' + $t('memberManage.status')">
                <el-select v-model="edit_status" :placeholder="$t('memberManage.chooseStatus')" clearable>
                  <el-option :label="$t('memberManage.normal')" :value="0" />
                  <el-option :label="$t('memberManage.blocked')" :value="1" />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editLightBoxVisible = false">
                {{ $t('lightbox.cancel') }}
              </el-button>
              <el-button type="primary" @click="updateAdmin">
                {{ $t('lightbox.confirm') }}
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
      response: {
        total: 6,
        list: [
          { id: 10001, type: 1, name: '王子恒', create_date: '2020-01-04 23:23:11', status: 0, account: 'alexWang123' },
          { id: 10002, type: 2, name: '謝榮瑞', create_date: '2020-02-05 23:23:11', status: 0, account: 'lungray777' },
          { id: 10003, type: 1, name: '康哥', create_date: '2020-03-04 23:23:11', status: 0, account: 'kankan321123' },
          { id: 10004, type: 0, name: '洪俊倫', create_date: '2020-08-04 23:23:11', status: 0, account: 'eric5555' },
          { id: 10005, type: 1, name: '老皮', create_date: '2022-12-31 23:23:11', status: 1, account: 'pipi666' },
          { id: 10006, type: 1, name: 'Alex Wang', create_date: '2021-10-28 23:23:11', status: 0, account: 'dwighthowardabc' }
        ]
      },
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
      console.log('call api: /admin/list')
      this.list = this.response.list
      this.total = this.response.total
    },
    handleFilter() {
      console.log(this.listQuery.filter)
      this.currentPage = 1
      this.getList()
    },
    // 編輯會員
    handleEdit(list) {
      this.editLightBoxVisible = true
      this.edit_id = list.id
      this.edit_type = list.type
      this.edit_status = list.status
    },
    updateAdmin() {
      const data = {
        // 'token': getToken(),
        'id': this.edit_id,
        'type': this.edit_type,
        'status': this.edit_status
      }
      console.log(data)
      console.log('call api: /admin/edit')
      alert(this.$t('alert.editSuccess'))
      this.editLightBoxVisible = false
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
