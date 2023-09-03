import store from '@/store'
import { callApi } from './api'

export async function checkTagList(list) {
  if (!Array.isArray(list)) return
  if (!list.length) {
    callApi('tag', 'list', {}).then((res) => {
      store.dispatch('article/addTagList', res.list)
    })
  }
}

export async function checkUserList(list) {
  if (!Array.isArray(list)) return
  if (!list.length) {
    callApi('admin', 'list', {}).then((res) => {
      store.dispatch('article/addUserList', res.list)
    })
  }
}
