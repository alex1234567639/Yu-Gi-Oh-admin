import { callApi } from '@/api/api'

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

// 取得產品包裝列表後存進 localStorage
export function resetPackTypeList() {
  const packListQuery = {
    page: 0,
    limit: 0,
    filter: {
      status: 0
    }
  }
  callApi('packType', 'list', packListQuery).then((res) => {
    const list = res.list
    let productInfoArr = []
    for (let i = 0; i < list.length; i++) {
      productInfoArr.push({
        label: list[i].name,
        value: list[i].packType
      })
      productInfoArr = productInfoArr.sort((a, b) => {
        return a.label > b.label ? 1 : -1
      })
      setPackTypeList(productInfoArr)
    }
  })
}
