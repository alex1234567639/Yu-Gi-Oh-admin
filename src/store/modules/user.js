import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { decode, encode } from '@/utils/decode'
import { getPermit } from '@/api/permission.js'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  account: {},
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
      login({ data: encode(userInfo) })
        .then((response) => {
          const res = decode(response.data)
          commit('SET_TOKEN', res.token)
          commit('SET_ACCOUNT', userInfo.account)
          setToken(res.token)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    console.log(state.token, state.account)
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
          const data = decode(response.data).list[0]
          const { status: adminStatus, account, ...other } = data
          const permit = decode(
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
            ).data
          ).list[0]['permission']

          commit('SET_ROLES', permit[0])
          commit('SET_ACCOUNTINFO', other)
          resolve(permit[0])
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
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
