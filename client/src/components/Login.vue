<template>
  <div class="main-cntnr">
    <div class="rgt-cntnr">
      <h2>{{ $t('register') }}</h2>
      <input name="email" label="Email" type="email" v-model="email" :placeholder="$t('email')">
      <input type="text" name="name" :placeholder="$t('name')"/>
      <input type="text" name="firstname" :placeholder="$t('firstname')"/>
      <input type="text" name="login" :placeholder="$t('login')"/>
      <input name="password" label="Mot de passe" type="password" v-model="password" :placeholder="$t('password')"/>
      <input type="text" name="image" :placeholder="$t('download_image')"/>
      <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
      <br>
      <button @click="register">{{ $t('register-btn') }}</button><br><br>
    </div>
    <div class="lft-cntnr">
      <h2>{{ $t('signin') }}</h2>
      <input name="email" type="email" v-model="email" :placeholder="$t('email')"/>
      <input name="password" type="password" v-model="password" :placeholder="$t('password')"/>
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
export default {
  data () {
    return {
      email: '',
      password: '',
      registeremail: '',
      registerpassword: '',
      error: null,
      success: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
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
@import '../assets/css/application.scss';

.main-cntnr{
  padding-top: 5em;
}

.main-cntnr .rgt-cntnr, .main-cntnr .lft-cntnr{
  display: inline-block;
  vertical-align: top;
  padding: 3em;
  margin: 0 1em;
  border-radius: .3em;
  text-align: center;
  background: $dark;
  width: 30em;
}

h2{
  color: $grey-txt;
  font-size: 1.8em;
  font-weight: 400;
}

input{
  font-size: 1.2em;
  background: $darker;
  display: block;
  border: 1px solid $black;
  width: 100%;
  box-sizing: border-box;
  margin:.6em 0;
  padding: .5em 1em;
  color: $white;
  border-radius: .3em;
}

::placeholder{
  color: $grey-txt;
}

button{
  width:100%;
  margin: .3em;
}

button img{
  margin: 0;
}

.lft-cntnr a:first-of-type button{
  background: $white;
}

.lft-cntnr a:nth-of-type(2) button{
  background: $facebook-blue;
}

.lft-cntnr a:nth-of-type(3) button{
  background: $google-red;
}
</style>
