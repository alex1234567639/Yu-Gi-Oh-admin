<template>
  <div class="components-container">
    <template>
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('adminManage.list')" name="admin_list">
          <!-- 搜尋Bar -->
          <div class="filter-container">
            <el-select v-model="listQuery.filter.status" :placeholder="$t('adminManage.chooseStatus')" clearable class="filter-item select">
              <el-option :label="$t('adminManage.normal')" :value="0" />
              <el-option :label="$t('adminManage.blocked')" :value="1" />
            </el-select>
            <el-select v-model="listQuery.filter.type" :placeholder="$t('adminManage.chooseType')" clearable class="filter-item select">
              <el-option :label="$t('adminManage.manager')" :value="0" />
              <el-option :label="$t('adminManage.blogAdminUser')" :value="1" />
              <el-option :label="$t('adminManage.blogOnlyUser')" :value="2" />
            </el-select>
            <el-input
              v-model="listQuery.filter.name"
              :placeholder="$t('adminManage.inputMame')"
              clearable
              type="text"
              class="filter-item input"
            />
            <el-input
              v-model="listQuery.filter.name"
              :placeholder="$t('adminManage.inputAccount')"
              clearable
              type="text"
              class="filter-item input"
            />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              {{ $t('adminManage.search') }}
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
            <el-table-column :label="$t('adminManage.no')" align="center" width="60">
              <template slot-scope="row">
                {{ row.$index + 1 + listQuery.page*listQuery.limit }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('adminManage.id')" prop="id" align="center" width="130" />
            <el-table-column :label="$t('adminManage.account')" prop="account" align="center" width="160" />
            <el-table-column :label="$t('adminManage.type')" prop="type" align="center" width="110">
              <template slot-scope="{row}">
                <el-tag v-if="row.type === 0" type="info">{{ $t('adminManage.manager') }}</el-tag>
                <el-tag v-if="row.type === 1">{{ $t('adminManage.blogAdminUser') }}</el-tag>
                <el-tag v-if="row.type === 2" type="warning">{{ $t('adminManage.blogOnlyUser') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('adminManage.name')" prop="name" align="center" width="150" />
            <el-table-column :label="$t('adminManage.createDate')" prop="create_date" align="center" width="140">
              <template slot-scope="{row}">
                <span>{{ row.create_date | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('adminManage.status')" prop="status" align="center" width="100">
              <template slot-scope="{row}">
                <el-tag v-if="row.status === 0" type="success">{{ $t('adminManage.normal') }}</el-tag>
                <el-tag v-if="row.status === 1" type="danger">{{ $t('adminManage.blocked') }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
export default {
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
      }
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
