// 僅能選擇未來時間
const calendarFutureDatePicker = {
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}

// 僅能選擇過去時間
const calendarPastDatePicker = {
  disabledDate(time) {
    return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
  }
}

export { calendarFutureDatePicker, calendarPastDatePicker }
