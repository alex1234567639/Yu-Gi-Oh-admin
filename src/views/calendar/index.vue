<template>
  <div class="calendar-wrapper">
    <el-calendar v-model="calendarValue">
      <template #dateCell="{ data }">
        <div class="calendar-item" @click="editDayData(data.day)">
          <div class="calendar-time flex-between">
            <span>{{ data.day.split("-").slice(2).join("") }}</span>
            <!-- <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editDayData(data.day)"
            /> -->
          </div>
          <div>
            <span
              v-for="(item, index) in list"
              :key="index"
              class="remark-text calendar-time"
            >
              {{ item.date.split(" ")[0] === data.day ? item.title : "" }}
            </span>
          </div>
        </div>
      </template>
    </el-calendar>

    <el-dialog width="84%" title="列表" :visible.sync="editVisible">
      <el-tabs v-model="tabName">
        <el-tab-pane :label="$t('calendar.list')" name="list">
          <div v-if="nowStatus === 'list'" class="control-dialog-height">
            <el-table
              :data="editTarget"
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
                :label="$t('calendar.title')"
                prop="title"
                align="center"
                width="200"
              />
              <el-table-column
                :label="$t('calendar.content')"
                prop="content"
                align="center"
                width="450"
              />
              <el-table-column
                :label="$t('calendar.date')"
                prop="date"
                align="center"
                width="180"
              />
              <el-table-column
                :label="$t('calendar.type')"
                prop="type"
                align="center"
                width="100"
              >
                <template slot-scope="{ row }">
                  <el-tag>{{
                    typeOption.find((el) => el.value === row.type).label
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
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleEdit(row)"
                  >
                    {{ $t("common.edit") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <Form
            v-else-if="nowStatus === 'edit'"
            :form-data="editFormData"
            @emitData="confirmEdit"
            @cancel="nowStatus = 'list'"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('calendar.add')" name="add">
          <Form
            class="form-container"
            :form-data="addFormData"
            :confirm-text="$t('lightbox.add')"
            @cancel="clearAdd"
            @emitData="confirmAdd"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { callApi } from '@/api/api'
import Form from '@/components/Form/index'
import allStore from '@/store'
import { removeNullAndEmptyString } from '@/utils/index.js'

export default {
  components: {
    Form
  },
  data() {
    return {
      tabName: 'list',
      list: [],
      listQuery: {
        page: 0,
        limit: 20,
        filter: {
          date: ''
        }
      },
      calendarValue: '',
      resDate: [
        { date: '2023-02-08', content: '放假' },
        { date: '2023-02-09', content: '放假' },
        { date: '2023-02-10', content: '划水' },
        { date: '2023-02-11', content: '打牌' },
        { date: '2023-02-12', content: '打牌' },
        { date: '2023-02-13', content: '打牌' },
        { date: '2023-02-14', content: '打牌' },
        { date: '2023-02-15', content: '打牌' }
      ],
      typeOption: [
        { label: this.$t('calendar.optionLabel0'), value: 0 },
        { label: this.$t('calendar.optionLabel1'), value: 1 },
        { label: this.$t('calendar.optionLabel2'), value: 2 }
      ],
      nowStatus: 'list',
      nowPickDate: {
        year: 0,
        month: 0
      },
      // 編輯
      editTarget: [],
      editVisible: false,
      editFormData: {},
      editData: {
        _id: { preset: '' },
        title: {
          type: 'long-input',
          label: this.$t('calendar.title'),
          preset: ''
        },
        date: {
          type: 'time',
          label: this.$t('calendar.time'),
          preset: ''
        },
        url: {
          type: 'long-input',
          label: this.$t('calendar.url'),
          preset: ''
        },
        type: {
          type: 'select',
          label: this.$t('calendar.type'),
          preset: 0,
          options: [
            { label: this.$t('calendar.optionLabel0'), value: 0 },
            { label: this.$t('calendar.optionLabel1'), value: 1 },
            { label: this.$t('calendar.optionLabel2'), value: 2 }
          ]
        },
        content: {
          type: 'long-input',
          label: this.$t('calendar.content'),
          preset: ''
        }
      },
      // 新增
      addFormData: {
        title: {
          type: 'long-input',
          label: this.$t('calendar.title'),
          preset: ''
        },
        date: {
          type: 'time',
          label: this.$t('calendar.time'),
          preset: ''
        },
        url: {
          type: 'long-input',
          label: this.$t('calendar.url'),
          preset: ''
        },
        type: {
          type: 'select',
          label: this.$t('calendar.type'),
          preset: 0,
          options: [
            { label: this.$t('calendar.optionLabel0'), value: 0 },
            { label: this.$t('calendar.optionLabel1'), value: 1 },
            { label: this.$t('calendar.optionLabel2'), value: 2 }
          ]
        },
        content: {
          type: 'long-input',
          label: this.$t('calendar.content'),
          preset: ''
        }
      }
    }
  },
  watch: {
    calendarValue(val) {
      this.nowPickDate.year = new Date(val).getFullYear()
      this.nowPickDate.month = new Date(val).getMonth() + 1
    }
  },
  created() {
    this.$nextTick(() => {
      const getTimes = (x) => {
        const d = new Date(this.calendarValue)
        this.handleDateRange(d.getFullYear(), d.getMonth() + 1 + x)
      }
      // 前
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)'
      )
      prevBtn.addEventListener('click', (e) => {
        getTimes(0)
      })
      // 後
      const nextBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(3)'
      )
      nextBtn.addEventListener('click', (e) => {
        getTimes(0)
      })
      // 今天
      const todayBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)'
      )
      todayBtn.addEventListener('click', (e) => {
        getTimes(0)
      })
    })
  },
  mounted() {
    const now = new Date()
    this.handleDateRange(now.getFullYear(), now.getMonth() + 1)
  },
  methods: {
    handleTime(s) {
      return s < 10 ? '0' + s : s
    },
    makeTimeFormat(tempTime) {
      return `${tempTime.getFullYear()}-${this.handleTime(
        tempTime.getMonth() + 1
      )}-${this.handleTime(
        tempTime.getDate()
      )} ${tempTime.getHours()}:${tempTime.getMinutes()}:${tempTime.getSeconds()}`
    },
    handleDateRange(year, month, cb = () => {}) {
      const time = new Date(`${year}-${month}-1`)
      console.log(time)
      this.listQuery.filter.date = time
      callApi('calendar', 'list', this.listQuery).then((res) => {
        this.list = res.list
        cb()
      })
    },
    editDayData(val) {
      this.editVisible = true
      this.editTarget = JSON.parse(
        JSON.stringify(this.list.filter((el) => el.date.split(' ')[0] === val))
      )
    },
    handleEdit(row) {
      this.nowStatus = 'edit'
      // 帶入預設值
      Object.keys(this.editData).forEach((key) => {
        this.editData[key].preset = row[key]
      })
      this.editFormData = this.editData
    },
    confirmEdit(data) {
      data.date = this.makeTimeFormat(new Date(data.date))

      if (allStore.state.settings.showLog) {
        console.log(data)
      }
      callApi('calendar', 'edit', removeNullAndEmptyString(data)).then(() => {
        alert(this.$t('alert.editSuccess'))
        this.handleDateRange(
          this.nowPickDate.year,
          this.nowPickDate.month,
          () => {
            console.log(this.list)
            console.log(data.date.split(' ')[0])
            this.editTarget = JSON.parse(
              JSON.stringify(
                this.list.filter(
                  (el) => el.date.split(' ')[0] === data.date.split(' ')[0]
                )
              )
            )
            this.nowStatus = 'list'
          }
        )
      })
    },
    clearAdd() {
      Object.keys(this.addFormData).forEach((key) => {
        this.addFormData[key].preset = ''
      })
      this.tabName = 'list'
    },
    formValidate(form) {
      const validationRules = [
        {
          field: 'content',
          condition: !form.content,
          message: 'calendar.inputContent'
        },
        {
          field: 'date',
          condition: !form.date,
          message: 'calendar.inputDate'
        },
        {
          field: 'title',
          condition: !form.title,
          message: 'calendar.inputTitle'
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
      data.date = this.makeTimeFormat(new Date(data.date))
      if (allStore.state.settings.showLog) {
        console.log(data)
      }
      if (this.formValidate(data)) {
        callApi('calendar', 'add', removeNullAndEmptyString(data)).then(() => {
          alert(this.$t('alert.addSuccess'))
          this.handleDateRange(
            this.nowPickDate.year,
            this.nowPickDate.month,
            () => {
              this.editTarget = JSON.parse(
                JSON.stringify(
                  this.list.filter(
                    (el) => el.date.split(' ')[0] === data.date.split(' ')[0]
                  )
                )
              )
            }
          )
          this.clearAdd()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  padding: 20px;
  .remark-text {
    font-size: 8px;
  }
  .calendar-item {
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .calendar-time {
    height: 16px;
    line-height: 16px;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    height: auto;
  }
  .el-dialog {
    width: 80%;
  }
  .control-dialog-height {
    height: 60vh;
  }
}
</style>
