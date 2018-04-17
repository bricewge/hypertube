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
         v-model="form.email"
         v-validate="'required|email'"
         :placeholder="$t('email')"/>
  <input type="text"
         name="name"
         v-model="form.name"
         v-validate="'required|alpha'"
         :placeholder="$t('name')"/>
  <input type="text"
         name="firstname"
         v-model="form.firstname"
         :placeholder="$t('firstname')"/>
  <input type="text"
         name="login"
         v-model="form.login"
         :placeholder="$t('login')"/>
  <input name="password"
         label="Mot de passe"
         type="password"
         v-model="form.password"
         :placeholder="$t('password')"/>
  <input type="text"
         name="image"
         :placeholder="$t('download_image')"/>
  <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
  <span v-show="errors.any()">{{ errors.all() }}</span>
  <br>
  <button>{{ $t('register-btn') }}</button><br><br>
<!-- </div> -->
</v-form>
</template>

<script>
import {validPassword, nonEmptyPassword, validEmail} from '@/util/validation'

export default {
  data () {
    return {
      form: {
        email: '',
        firstname: '',
        name: '',
        login: '',
        password: '',
        image: '' // TODO Manage thoses fucking images!!!
      },
      error: null,
      valid: false
    }
  },

  methods: {
    async register () {
      if (!await this.$validator.validateAll()) return
      console.log(this)
      try {
        const response = await this.$auth.register({
          data: this.form
          // error: function (err) { }
        })
        // this.alert.visible = false
      } catch (err) {
        this.error = err.response.data.message || err.response.data.error
        // this.alert.type = 'error'
        // this.alert.message = err.response.data.message
        // this.alert.visible = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@import '../assets/css/login.scss';
</style>
