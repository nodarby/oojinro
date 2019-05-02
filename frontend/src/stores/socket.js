import io from 'socket.io-client'
import axios from 'axios'

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
      let that = this
      const socket = io.connect(process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/')
      state.socket = socket

      socket.on('connect', function(){
        console.log('接続', socket.id, that.getters['user/slug'])
        axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/socket/connected', {socketSlug: socket.id, userSlug: that.getters['user/slug']}).then(function(res){
          console.log('Connected', res)
        }).catch(function(err){
          console.log('Failed Create Room')
        })
      })
    }
  }
}