const state = {
  tagList: [],
  userList: []
}

const mutations = {
  ADD_TAT_LIST: (state, log) => {
    state.tagList = log
  },
  ADD_USER_LIST: (state, log) => {
    state.userList = log
  }
}

const actions = {
  addTagList({ commit }, log) {
    commit('ADD_TAT_LIST', log)
  },
  addUserList({ commit }, log) {
    commit('ADD_USER_LIST', log)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
