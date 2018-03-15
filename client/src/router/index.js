import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Movie from '@/components/Movie'
import User from '@/components/User'
import Player from '@/components/Player'

Vue.use(Router)

export default new Router({
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
      path: '/movies/:movie_id',
      name: 'movie',
      component: Movie
    },
    {
      path: '/users/:id',
      name: 'user',
      component: User
    },
    {
      path: '/player/:movie_id',
      name: 'play',
      component: Player
    }
  ]
})
