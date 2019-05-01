import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate";
import socket from './stores/socket.js'
import room from './stores/room.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    socket,
    room
  },
  plugins: [
    createPersistedState({
      key: 'oojinro',
      paths: ['room']
    })
  ]
})
