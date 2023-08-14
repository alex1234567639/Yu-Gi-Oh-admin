import request from '@/utils/request'
import store from '@/store'
import { callApi } from './api'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}

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
