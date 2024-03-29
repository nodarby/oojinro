import axios from 'axios'

const state = {
  slug: null,
  users: [],
  classes: []
}
export default {
  namespaced: true,
  state,
  getters: {
    slug: (state) => {
      return state.slug
    },
    users: (state) => {
      return state.users
    },
    classes: (state) => {
      return state.classes
    },
    phase: (state) => {
      return state.phase
    },
    result: (state) => {
      return state.result
    }
  },
  mutations: {
    slug: (state, payload) => {
      state.slug = payload
    },
    users: (state, payload) => {
      state.users = payload
    },
    classes: (state, payload) => {
      state.classes = payload
    },
    phase: (state, payload) => {
      state.phase = payload
    },
    result: (state, payload) => {
      state.result = payload
    }
  },
  actions: {
    create: (context) => {
      console.log('Create Room')
      console.log('Doing Create Room')
      return new Promise(function(resolve, reject){
        axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/room/create').then(function(res){
          console.log('Done Create Room')
          console.log(res.data)
          context.commit('user/phase', 'GameWaiting', {root: true})
          context.commit('user/klass', null, {root: true})
          resolve(res.data)
        }).catch(function(err){
          console.log('Failed Create Room')
          reject()
        })
      })
    },
    enter: (context, payload) => {
      console.log('Enter Room')
      console.log('Doing Enter Room')
      const roomSlug = payload.roomSlug
      const userSlug = context.rootGetters['user/slug']
      console.log(roomSlug, userSlug)
      return new Promise(function(resolve, reject){
        axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/room/enter', {roomSlug: roomSlug, userSlug: userSlug}).then(function(res){
          console.log('Done Enter Room')
          console.log(res.data)
          context.commit('slug', res.data.roomSlug)
          context.commit('users', res.data.users)
          context.commit('classes', res.data.classes)
          context.commit('user/phase', res.data.phase, {root: true})
          context.commit('user/klass', null, {root: true})
          resolve(res.data)
        }).catch(function(err){
          console.log('Failed Enter Room')
          reject(err)
        })
      })
    }
  }
}