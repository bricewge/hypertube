import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Movie from '@/components/Movie'
import User from '@/components/User'
import Account from '@/components/Account'
import Player from '@/components/Player'
import Forgot from '@/components/Forgot'
import Reset from '@/components/Reset'

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
      path: '/forgot',
      name: 'forgot',
      meta: {auth: false},
      component: Forgot
    },
    {
      path: '/reset/:token',
      name: 'reset',
      meta: {auth: false},
      component: Reset
    },
    {
      path: '/movie',
      name: 'movie',
      component: Movie,
      meta: {auth: true}
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: {auth: true}
    },
    {
      path: '/user/:login',
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
