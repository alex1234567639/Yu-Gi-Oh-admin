import request from '@/utils/request'
import { getAccount, getToken } from '@/utils/auth'
import { encode } from '@/utils/decode'

export function api_add(path, method = 'add' || 'list' || 'edit', data) {
  return request({
    url: `/api/${path}/${method}`,
    method: 'post',
    data: encode({
      token: getToken(),
      tokenReq: getAccount(),
      ...data
    })
  })
}
