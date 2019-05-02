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
      component: () => import('./views/Room.vue')
    },
    {
      path: '*',
      component: () => import('./views/404.vue')
    }
  ]
})
