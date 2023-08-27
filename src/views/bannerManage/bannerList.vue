<template>
  <div class="banner-list-wrapper">
    <div class="components-container">
      <template>
        <el-tabs v-model="tabName">
          <el-tab-pane :label="$t('banner.list')" name="banner_list">
            <!--搜尋Bar-->
            <div class="filter-container">
              <el-date-picker
                v-model="dateInterval"
                type="daterange"
                :range-separator="$t('calendar.to')"
                :start-placeholder="$t('calendar.startDate')"
                :end-placeholder="$t('calendar.endDate')"
                class="date-picker"
                :picker-options="calendarPastDatePicker"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="getList"
              >
                {{ $t("common.search") }}
              </el-button>
            </div>

            <!-- 表格 -->
            <el-table
              v-loading="loading"
              :data="list"
              border
              fit
              highlight-current-row
              class="table-list"
            >
              <el-table-column :label="$t('common.no')" type="index" align="center" width="60" />
              <el-table-column
                :label="$t('banner.photo_pc')"
                prop="photo_pc"
                align="center"
                width="250"
              >
                <span slot-scope="{row}">
                  <img :src="row.photo_pc" style="width:220px" alt="">
                </span>
              </el-table-column>
              <el-table-column
                :label="$t('banner.photo_mobile')"
                prop="photo_mobile"
                align="center"
                width="200"
              >
                <span slot-scope="{row}">
                  <img :src="row.photo_mobile" style="width:160px" alt="">
                </span>
              </el-table-column>
              <el-table-column
                :label="$t('banner.title')"
                prop="title"
                align="center"
                width="200"
              />
              <el-table-column
                :label="$t('banner.subtitle')"
                prop="subtitle"
                align="center"
                width="220"
              />
              <el-table-column
                :label="$t('banner.date')"
                prop="date"
                align="center"
                width="120"
              >
                <template slot-scope="{row}">
                  <span>{{ row.date | parseTime('{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.action')"
                align="center"
                width="100"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row }">
                  <el-button type="primary" size="mini" @click="handleEdit(row)">
                    {{ $t("common.edit") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 新增 -->
          <el-tab-pane :label="$t('banner.add')" name="add_banner">
            <BannerAdd @addCompleted="addCompleted" />
          </el-tab-pane>
        </el-tabs>

        <!-- 編輯 -->
        <el-dialog
          :title="$t('banner.edit')"
          class="edit-dialog"
          :visible.sync="editVisible"
        >
          <el-form class="form" label-width="120px" label-position="left">
            <el-form-item :label="$t('banner.photo_pc')">
              <div>
                <label class="photo-container">
                  <input
                    class="photo-btn"
                    type="file"
                    accept="image/*"
                    @change="chooseFile($event, 'pc')"
                  >
                  {{ $t("form.choosePhoto") }}
                </label>
                <img v-if="editPcPhoto" class="img" :src="editPcPhoto" alt="">
              </div>
            </el-form-item>
            <el-form-item :label="$t('banner.photo_mobile')">
              <label class="photo-container">
                <input
                  class="photo-btn"
                  type="file"
                  accept="image/*"
                  @change="chooseFile($event, 'mb')"
                >
                {{ $t("form.choosePhoto") }}
              </label>
              <img v-if="editMbPhoto" class="img" :src="editMbPhoto" alt="">
            </el-form-item>
          </el-form>
          <Form
            :form-data="editFormData"
            @emitData="confirmEdit"
            @cancel="editVisible = false"
          />
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import BannerAdd from './bannerAdd'
import { callApi } from '@/api/api'
import { removeNullAndEmptyString } from '@/utils/index.js'
import { uploadImage } from '@/utils/image'
import store from '@/store'
import { calendarPastDatePicker } from '@/utils/calendarPick.js'
import { height_limit, KB_limit, width_limit } from '@/config/main'

export default {
  components: {
    Form,
    BannerAdd
  },
  data() {
    return {
      list: null,
      tabName: 'banner_list',
      calendarPastDatePicker,
      dateInterval: [],
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          begin_date: '',
          end_date: ''
        }
      },
      loading: false,
      // 編輯
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        title: { type: 'long-input', label: this.$t('banner.title'), preset: '' },
        subtitle: { type: 'long-input', label: this.$t('banner.subtitle'), preset: '' },
        url: { type: 'long-input', label: this.$t('banner.url'), preset: '' }
      },
      editPcPhoto: '',
      editMbPhoto: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      if (this.dateInterval === null || this.dateInterval.length === 0) {
        this.listQuery.filter.begin_date = ''
        this.listQuery.filter.end_date = ''
      } else {
        [this.listQuery.filter.begin_date, this.listQuery.filter.end_date] = this.dateInterval
      }
      callApi('banner', 'list', removeNullAndEmptyString(this.listQuery)).then((res) => {
        this.list = res.list
        this.loading = false
      })
    },
    // 編輯
    handleEdit(row) {
      this.editVisible = true
      this.clearPhoto()

      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })
      this.editFormData = this.editData
    },
    confirmEdit(data) {
      data.photo_pc = this.editPcPhoto
      data.photo_mobile = this.editMbPhoto
      if (store.state.settings.showLog) {
        console.log(data)
      }
      callApi('banner', 'edit', removeNullAndEmptyString(data)).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.getList()
        this.editVisible = false
      })
    },
    // 圖片
    chooseFile(event, type) {
      if (event.target.files.length === 0) {
        return
      }
      const size = event.target.files[0].size
      const sizeKB = size / 1024
      // 檢查photo不大於1M
      if (sizeKB >= KB_limit) {
        this.$alert(this.$t('alert.fileTooLarge'), this.$t('alert.alert'), {
          confirmButtonText: this.$t('alert.confirm')
        })
      } else {
        const vm = this
        uploadImage(
          event,
          function(result) {
            if (type === 'pc') {
              vm.editPcPhoto = result.result
            }
            if (type === 'mb') {
              vm.editMbPhoto = result.result
            }
          },
          function(err) {
            alert(vm.$t('alert.' + err))
          },
          width_limit,
          height_limit
        )
      }
    },
    clearPhoto() {
      this.editPcPhoto = ''
      this.editMbPhoto = ''
    },
    // 新增
    addCompleted() {
      this.getList()
      this.tabName = 'banner_list'
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  .date-picker {
    margin-right: 10px;
    vertical-align: top;
  }
}
.table-list {
  width: fit-content;
}
.form {
  padding: 0 20px;
  & .photo-container {
    margin-right: 20px;
    padding: 10px 21px 10px 18px;
    color: #ffffff;
    background-color: #1890ff;
    border-color: #1890ff;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition-duration: 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
    cursor: pointer;
    &:hover {
      background-color: #51a6f6;
    }
    & .photo-btn {
      width: 1px;
      height: 1px;
      opacity: 0;
      overflow: hidden;
      z-index: -1;
    }
  }
  & .img {
    width: 150px;
  }
}
</style>
