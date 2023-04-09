<template>
  <div class="calendar-wrapper">
    <el-calendar v-model="calendarValue">
      <template #dateCell="{ data }">
        <div class="calendar-item">
          <div class="calendar-time">
            {{ data.day.split('-').slice(2).join('') }}
          </div>
          <div>
            <span v-for="(item, index) in dealMyDate(data.day)" :key="index" class="remark-text calendar-time">
              {{ item }}
            </span>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      ]
    }
  },
  watch: {
    calendarValue(val) {
      console.log(val)
    }
  },
  methods: {
    dealMyDate(v) {
      let res = ''
      for (let index = 0; index < this.resDate.length; index++) {
        if (this.resDate[index].date === v) {
          res = this.resDate[index].content
          break
        }
      }
      return res
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
  }
  .calendar-time {
    height: 16px;
    line-height: 16px;
  }
}
</style>
