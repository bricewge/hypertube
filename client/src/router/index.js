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
      component: Home,
      meta: {auth: true}
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {auth: false}
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie,
      meta: {auth: true}
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {auth: true}
    },
    {
      path: '/player/:imdbId',
      name: 'play',
      component: Player,
      meta: {auth: true}
    }
  ]
})
