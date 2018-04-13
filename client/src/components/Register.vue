<template>
<!-- <div class="rgt-cntnr"> -->
<v-form class="rgt-cntnr"
        v-model="valid"
        ref="form"
        @submit.prevent="register"
        lazy-validation>
  <h2>{{ $t('register') }}</h2>
  <input name="email"
         type="email"
         v-model="email"
         v-validate="'required|email'"
         :placeholder="$t('email')"/>
  <input type="text"
         name="name"
         v-model="name"
         v-validate="'required|alpha'"
         :placeholder="$t('name')"/>
  <input type="text"
         name="firstname"
         v-model="firstname"
         :placeholder="$t('firstname')"/>
  <input type="text"
         name="login"
         v-model="login"
         :placeholder="$t('login')"/>
  <input name="password"
         label="Mot de passe"
         type="password"
         v-model="password"
         :placeholder="$t('password')"/>
  <input type="text"
         name="image"
         :placeholder="$t('download_image')"/>
  <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
  <span v-show="errors.any()">{{ errors.all() }}</span>
  <br>
  <button @click="register">{{ $t('register-btn') }}</button><br><br>
<!-- </div> -->
</v-form>
</template>

<script>
import AuthenticationService from '@/service/AuthenticationService'
// import validation from '@/util/validation'
import {validPassword, nonEmptyPassword, validEmail} from '@/util/validation'

export default {
  data () {
    return {
      email: '',
      firstname: '',
      name: '',
      login: '',
      password: '',
      image: '', // TODO Manage thoses fucking images!!!
      error: null,
      valid: false
    }
  },

  methods: {
    async register () {
      // this.samePasswords()
      if (! await this.$validator.validateAll()) return
      console.log(this)
      try {
        const data = {
          login: this.login,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password
        }
        const response = await this.$auth.register({
          data: data,
          error: function (err) { }
        })
        // this.alert.visible = false
      } catch (err) {
        this.error = err.response.data.error
        // this.alert.type = 'error'
        // this.alert.message = err.response.data.message
        // this.alert.visible = true
      }
    },
    // async register () {
    //   try {
    //     const response = await AuthenticationService.register({
    //       email: this.email,
    //       password: this.password
    //     })
    //     this.$store.dispatch('setToken', response.data.token)
    //     this.$store.dispatch('setUser', response.data.user)
    //   } catch (err) {
    //     this.error = err.response.data.error
    //   }
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@import '../assets/css/login.scss';
</style>
