import Vue from 'vue'
import store from './store'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/sample',
      component: () => import('./views/Sample.vue')
    },
    {
      path: '/profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/room/:name',
      component: () => import('./views/Room.vue'),
      beforeEnter: (to, from, next) => {
        const socket = store.getters['socket/socket']

        // 部屋入室の動作
        console.log('entering room:'+to.params.name)
        socket.emit('requestEnterRoom', {uuid: store.getters['user/uuid'], roomName: to.params.name})

        // 部屋入室の結果受け取り
        socket.once('responseEnterRoom', function (data) {
          if (data !== null){
            console.log("entered room")
            console.log(data)
            // 入室できた
            if (store.getters['user/name'] === '') { // 名前が存在しない場合
              console.log('username is not existed')
              next({path: '/profile', query: {'redirect_to': '/room/'+to.params.name}})
              return
            }
            if (store.getters['room/name'] === '') { // 今まで部屋に入ったことがない場合
              console.log('new room entering')
              store.commit('room/name', to.params.name)
              next()
            } else if (store.getters['room/name'] === to.params.name){ // 今まで入っていた部屋と同じ部屋に入る場合
              console.log('continue room entering')
              next()
            } else if(store.getters['room/name'] !== to.params.name) { // 今まで入っていた部屋とは違う部屋に入る場合
              console.log('different room entering')
              // 退出処理を行う
              store.commit('room/name', '')
              // そのあと入室
              store.commit('room/name', to.params.name)
              next()
            }
          }else{
            // 入室できなかった
            next(false)
          }
        })
      }
    },
    {
      path: '*',
      component: () => import('./views/404.vue')
    }
  ]
})
