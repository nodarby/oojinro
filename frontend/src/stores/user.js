import axios from 'axios'

const state = {
  name: '',
  slug: ''
}
export default {
  namespaced: true,
  state,
  getters: {
    name: (state) => {
      return state.name
    },
    slug: (state) => {
      return state.slug
    }
  },
  mutations: {
    name: (state, payload) => {
      state.name = payload
    },
    slug: (state, payload) => {
      state.slug = payload
    }
  },
  actions: {
    loginOrSignup: (context) => {
      console.log('Login or Signup')

      const slug = context.state.slug
      if (slug !== ''){ // slugが存在する場合
        console.log('Doing Log in')
        return axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/login', {userSlug: slug}).then(function(res){
          console.log('Done Log in')
          console.log(res.data)
          context.commit('slug', res.data.userSlug)
          context.commit('name', res.data.userName)
        }).catch(function(err){
          console.log('Failed Log in')
          // ログインに失敗したら新しいアカウントを取得しようとする
          console.log('Doing Sign up')
          return axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/signup').then(function(res){
            console.log('Done Sign Up')
            console.log(res.data)
            context.commit('slug', res.data.userSlug)
            context.commit('name', res.data.userName)
          }).catch(function(err){
            console.log('Failed Sign Up')
          })
        })
      }else{ // slugが存在しない場合
        console.log('Doing Sign up')
        return axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/signup').then(function(res){
          console.log('Done Sign Up')
          console.log(res.data)
          context.commit('slug', res.data.userSlug)
          context.commit('name', res.data.userName)
        }).catch(function(err){
          console.log('Failed Sign Up')
        })
      }
    },
    update: (context, payload) => {
      console.log('Update User')
      const slug = context.state.slug
      const name = payload.name
      const roomSlug = context.rootGetters['room/slug']
      return new Promise(function(resolve, reject){
        axios.post((process.env.NODE_ENV === 'development' ? 'http://192.168.33.10:8080/' : '/') + 'api/v1/profile', {userSlug: slug, userName: name, roomSlug: roomSlug}).then(function(res){
          console.log('Done Update User')
          console.log(res.data)
          context.commit('slug', res.data.userSlug)
          context.commit('name', res.data.userName)
          resolve()
        }).catch(function(err){
          console.log('Failed Update User')
          reject()
        })
      })
    }
  }
}