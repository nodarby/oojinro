import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate";
import socket from './stores/socket.js'
import room from './stores/room.js'
import user from './stores/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    socket,
    room,
    user
  },
  plugins: [
    createPersistedState({
      key: 'oojinro',
      paths: ['room', 'user']
    })
  ]
})
