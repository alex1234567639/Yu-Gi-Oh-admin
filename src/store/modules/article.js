const state = {
  tagList: []
}

const mutations = {
  ADD_TAT_LIST: (state, log) => {
    state.tagList = log
  }
}

const actions = {
  addTagList({ commit }, log) {
    commit('ADD_TAT_LIST', log)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
