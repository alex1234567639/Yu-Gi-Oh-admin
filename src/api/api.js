import request from '@/utils/request'
import { getAccount, getToken } from '@/utils/auth'
import { encode } from '@/utils/decode'

export function callApi(path, method = 'add' || 'list' || 'edit', datas = {}) {
  return request({
    url: `/api/${path}/${method}`,
    method: 'post',
    data: {
      data: encode({
        token: getToken(),
        tokenReq: getAccount(),
        ...datas
      })
    }
  })
}
