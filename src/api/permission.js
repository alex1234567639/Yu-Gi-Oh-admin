import request from '@/utils/request'

export function getPermit(data) {
  return request({
    url: '/api/permission/list',
    method: 'post',
    data
  })
}
