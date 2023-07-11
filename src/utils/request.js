import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { decode } from '@/utils/decode'
import i18n from '@/lang'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    // 測試環境顯示 request、response 的 console
    if (store.state.settings.showLog) {
      console.log({
        url: response.config.url.replace(response.config.baseURL, ''),
        requestData: decode(JSON.parse(response.config.data).data)
      })
      console.log({
        error_code: response.data.error_code,
        responseData: decode(response.data.data),
        status: response.status
      })
    }

    const res = response.data
    if (!res.error_code) return decode(res.data)
    else if (res.error_code && res.error_code !== 10009) {
      Message({
        message: i18n.t(`errorCode.${res.error_code}`),
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      Message({
        message: i18n.t(`errorCode.${res.error_code}`),
        type: 'warning',
        duration: 5 * 1000
      })

      return decode(res.data)
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
