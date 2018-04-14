<template>
  <div class="main-cntnr">
      <register />
    <div class="lft-cntnr">
      <h2>{{ $t('signin') }}</h2>
      <input name="email"
             type="email"
             v-model="email"
             :placeholder="$t('email')"/>
      <input name="password"
             type="password"
             v-model="password"
             :placeholder="$t('password')"/>
      <v-alert type="success" :value="succes" transition="scale-transition" v-html="succes"/>
      <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
      <br>
      <button @click="login">{{ $t('login-btn') }}</button><br><br>
      <h2>{{ $t('or') }}</h2>
      <router-link to='/auth/42'><button><img src='../assets/42.png'></button></router-link>
      <router-link to='/auth/facebook'><button><img src='../assets/facebook-letter-logo.png'></button></router-link>
      <router-link to='/auth/google'><button><img src='../assets/google-plus.png'></button></router-link>
    </div>
  </div>
</template>

<script>
// ADD the feature to download images
// POST form informations on SUBMIT register
// POST form informations on SUBMIT login
// add token to user if logged in successfully
import AuthenticationService from '@/service/AuthenticationService'
import Register from '@/components/Register'

export default {
  components: {
    Register
  },

  data () {
    return {
      email: '',
      password: '',
      error: null,
      success: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await this.$auth.login({ data: {
          email: this.email,
          password: this.password
        }})
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.success = 'Connexion réussie :D'
      } catch (err) {
        this.error = err.response.data.error
      }
    },
    async register () {
      try {
        const response = await AuthenticationService.register({
          email: this.registeremail,
          password: this.registerpassword
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  },
  watch: {
    email (value) {
      this.error = null
      this.success = null
    },
    password (value) {
      this.error = null
      this.success = null
    }
  },
  mounted () {
    setTimeout(() => {
      this.email = ''
    }, 1000)
  }
}
</script>

<style scoped lang='scss'>
@import '../assets/css/login.scss';
</style>
