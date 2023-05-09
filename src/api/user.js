import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/admin/list',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/api/admin/logout',
    method: 'post',
    data
  })
}
