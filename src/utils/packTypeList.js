export function getPackTypeList() {
  return JSON.parse(localStorage.getItem('packTypeList'))
}

export function setPackTypeList(arr) {
  const arrAsString = JSON.stringify(arr)
  return localStorage.setItem('packTypeList', arrAsString)
}

export function removePackTypeList() {
  return localStorage.removeItem('packTypeList')
}
