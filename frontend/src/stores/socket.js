import io from 'socket.io-client'

export default {
  namespaced: true,
  state: {
    socket: null
  },
  getters: {
    socket: (state) => {
      return state.socket
    },
  },
  mutations: {
    connect: function(state) {
      state.socket = io.connect(process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/')
      console.log('connected')
    }
  }
}