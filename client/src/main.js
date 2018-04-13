import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from '@/locale/index'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/store'
import VeeValidate from 'vee-validate'


Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VeeValidate)

Vue.router = router
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api'

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  refreshData: {enabled: false},
  registerData: {autoLogin: true},
  logoutData: {redirect: '/login'},
  notFoundRedirect: {path: '/'}
})

sync(store, router)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
