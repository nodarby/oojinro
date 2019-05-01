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

        // 部屋を探す処理

        // 部屋が存在しない場合
        //   next(false)

        // 部屋が存在する場合
        if (store.getters['user/name'] === '') { // 名前が存在しない場合
          console.log('名前の入力を促す')
          next({path: '/profile', query: {'redirect_to': '/room/'+to.params.name}})
          return
        }
        if (store.getters['room/name'] === '') { // 今まで部屋に入ったことがない場合
          console.log('初めての入室')
          store.commit('room/name', to.params.name)
          next()
        } else if (store.getters['room/name'] === to.params.name){ // 今まで入っていた部屋と同じ部屋に入る場合
          console.log('継続して入室')
          next()
        } else if(store.getters['room/name'] !== to.params.name) { // 今まで入っていた部屋とは違う部屋に入る場合
          console.log('違う部屋に入室')
          // 退出処理を行う
          store.commit('room/name', '')
          // そのあと入室
          store.commit('room/name', to.params.name)
          next()
        }
      }
    },
    {
      path: '*',
      component: () => import('./views/404.vue')
    }
  ]
})
