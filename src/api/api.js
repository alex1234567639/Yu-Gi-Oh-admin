import request from '@/utils/request'
import { getAccount, getToken } from '@/utils/auth'
import { encode } from '@/utils/decode'

export function callApi(path, method = 'add' || 'list' || 'edit', req = {}) {
  if (method === 'list' && !req.filter) req['filter'] = {}
  return request({
    url: `/api/${path}/${method}`,
    method: 'post',
    data: {
      data: encode({
        token: getToken(),
        tokenReq: getAccount(),
        ...req
      })
    }
  })
}
