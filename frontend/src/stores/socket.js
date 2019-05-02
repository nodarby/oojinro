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
    socket: (state, payload) => {
      state.socket = payload
    }
  },
  actions: {
    connect: function(context) {
      let that = this
      const socket = io.connect(process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/')
      context.commit('socket', socket)

      socket.on('/ws/v1/room/entered', function(res){
        console.log('entered watch: ', res)
        context.commit('room/slug', res.roomSlug, {root: true})
        context.commit('room/users', res.users, {root: true})
        context.commit('room/classes', res.classes, {root: true})
      })

      return new Promise(function(resolve, reject){
        socket.on('connect', function(){
          console.log('接続', socket.id, that.getters['user/slug'])
          axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/socket/connected', {socketSlug: socket.id, userSlug: that.getters['user/slug']}).then(function(res){
            resolve(res)
          }).catch(function(err){
            reject(err)
          })
        })
      })
    }
  }
}