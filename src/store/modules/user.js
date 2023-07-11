import { login, logout, getInfo } from '@/api/user'
import store from '@/store'
import {
  getToken,
  setToken,
  removeToken,
  getAccount,
  setAccount,
  removeAccount
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { encode, transPermitToArray } from '@/utils/decode'
import { getPermit } from '@/api/permission.js'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  account: getAccount(),
  accountInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_ACCOUNTINFO: (state, info) => {
    state.accountInfo = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      const { username, password } = userInfo
      login({ data: encode({ account: username, password }) })
        .then((response) => {
          // const res = decode(response.data)
          commit('SET_TOKEN', response.token)
          commit('SET_ACCOUNT', username)
          setToken(response.token)
          setAccount(username)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // console.log(state.token, state.account);
    if (typeof state.account !== 'string') return {}

    const obj = encode({
      token: state.token,
      tokenReq: state.account,
      page: 0,
      limit: 1,
      filter: {
        account: state.account
      }
    })
    return new Promise((resolve, reject) => {
      getInfo({ data: obj })
        .then(async(response) => {
          // const data = decode(response.data).list[0]
          const data = response.list[0]
          const { type: adminStatus, account, ...other } = data
          const permit = transPermitToArray(
            (
              await getPermit({
                data: encode({
                  token: state.token,
                  tokenReq: account,
                  page: 0,
                  limit: 1,
                  filter: {
                    type: adminStatus
                  }
                })
              })
            ).list[0]['permission'][0]
          )
          commit('SET_ROLES', permit)
          commit('SET_ACCOUNTINFO', other)
          await store.dispatch('permission/generateRoutes', permit)
          resolve(permit)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({ data: encode({ token: state.token, tokenReq: state.account }) })
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACCOUNTINFO', {})
          commit('SET_ACCOUNT', '')
          removeToken()
          removeAccount()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
