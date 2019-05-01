const state = {
  name: ''
}
export default {
  namespaced: true,
  state,
  getters: {
    name: (state) => {
      return state.name
    }
  },
  mutations: {
    name: (state, payload) => {
      state.name = payload
    }
  }
}