import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Movie from '@/components/Movie'
import User from '@/components/User'
import Player from '@/components/Player'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/player',
      name: 'play',
      component: Player
    }
  ]
})
