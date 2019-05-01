const state = {
  name: '',
  uuid: ''
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
    },
    uuid: (state) => {
      if (state.uuid === ''){
        console.log('uuid generated')
        state.uuid = new Date().getTime().toString(16) + Math.floor(Math.random() * 10000).toString(16)
      }
    }
  }
}