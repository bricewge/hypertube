<template>
<div class="main-cntnr">
  <register />
  <div class="lft-cntnr">
    <h2>{{ $t('signin') }}</h2>
    <v-form v-model="valid"
            ref="loginForm"
            @submit.prevent="login"
            lazy-validation>
      <input name="email"
             type="email"
             v-model="email"
             :placeholder="$t('email')"/>
      <input name="password"
             type="password"
             v-model="password"
             :placeholder="$t('password')"/>
      <v-alert type="success" :value="success" transition="scale-transition" v-html="success"/>
      <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
      <br>
      <button>{{ $t('login-btn') }}</button>
      <br><br>
      <router-link to="/forgot">Forgot password</router-link>
    </v-form>
    <h2>{{ $t('or') }}</h2>
    <button @click="oauth2('42')">
      <img src='../assets/42.png'>
    </button>
    <button @click="oauth2('facebook')">
      <img src='../assets/facebook-letter-logo.png'>
    </button>
    <button @click="oauth2('google')">
      <img src='../assets/google-plus.png'>
    </button>
  </div>
</div>
</template>

<script>
// TODO ADD the feature to upload images
import Register from '@/components/Register'

export default {
  components: {
    Register
  },

  data () {
    return {
      email: '',
      password: '',
      valid: false,
      error: null,
      success: null,
      code: this.$route.query.code,
      type: this.$route.params.type
    }
  },

  async mounted () {
    if (this.$route.query.tkn) {
      window.localStorage.setItem('default_auth_token', this.$route.query.tkn)
      this.$auth.token(null, this.$route.query.tkn)
      document.cookie = 'rememberMe=true'
      this.$auth.watch.authenticated = true
      await this.$auth.fetch()
      this.$router.push('/')
    }
  },

  methods: {
    async login () {
      try {
        const response = await this.$auth.login({ data: {
          email: this.email,
          password: this.password
        }})
      } catch (err) {
        this.error = err.response.data.error
      }
    },

    async oauth2 (strategy) {
      window.location.replace(`/api/auth/${strategy}`)
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
  }
}
</script>

<style scoped lang='scss'>
  @import '../assets/css/login.scss';
</style>
