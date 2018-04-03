import Vue from 'vue'
import Vuex from 'vuex'
import { app } from '../main'
import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    lang: 'fr',
    isUserLoggedIn: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (token) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    },
    setUser (state, user) {
      state.user = user
    },
    [types.SET_LANG] (state, payload) {
      app.$i18n.locale = payload
    }
  },
  actions: {
    setLang ({commit}, payload) {
      commit(types.SET_LANG, payload)
    },
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    }
  }
})
