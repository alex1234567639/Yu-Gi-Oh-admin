const state = {
  logs: [],
  goToLogin: false,
  test: 0
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.push(log)
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
  },
  GO_TO_LOGIN_PAGE: (state, bool) => {
    state.goToLogin = bool
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  },
  goToLoginPage({ commit }, bool) {
    commit('GO_TO_LOGIN_PAGE', bool)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
