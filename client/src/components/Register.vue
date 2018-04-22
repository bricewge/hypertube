<template>
<v-form class="rgt-cntnr"
        v-model="valid"
        ref="form"
        @submit.prevent="register"
        lazy-validation>
  <h2>{{ $t('register') }}</h2>
  <input name="email"
         type="email"
         v-model="user.email"
         v-validate="'required|email'"
         :placeholder="$t('email')"/>
  <input type="text"
         name="name"
         v-model="user.name"
         v-validate="'required|alpha'"
         :placeholder="$t('name')"/>
  <input type="text"
         name="firstname"
         v-model="user.firstname"
         v-validate="'required|alpha'"
         :placeholder="$t('firstname')"/>
  <input type="text"
         name="login"
         v-model="user.login"
         v-validate="'required'"
         :placeholder="$t('login')"/>
  <input name="password"
         label="Mot de passe"
         type="password"
         v-model="user.password"
         v-validate="'required|min:8'"
         :placeholder="$t('password')"/>
  <input name="image"
         type="file"
         accept="image/png,image/jpeg"
         @change="onFilePicked"
         v-validate="'required|image'"
         :placeholder="$t('download_image')"/>
  <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
  <span v-show="errors.any()">{{ errors.all() }}</span>
  <br>
  <button>{{ $t('register-btn') }}</button><br><br>
</v-form>
</template>

<script>
import {validPassword, nonEmptyPassword, validEmail} from '@/util/validation'

export default {
  data () {
    return {
      user: {
        email: '',
        firstname: '',
        name: '',
        login: '',
        password: '',
        image: null
      },
      form: new FormData(),
      error: null,
      valid: false
    }
  },

  methods: {
    onFilePicked ($event) {
      if ($event.target.files.length) {
        this.user.image = $event.target.files[0]
      }
    },

    async register () {
      if (!await this.$validator.validateAll()) return
      try {
        for (let key in this.user) {
          if (this.user[key]) this.form.set(key, this.user[key])
          else this.form.delete(key)
        }
        const headers = {'content-type': 'multipart/form-data'}
        const response = await this.$auth.register({
          data: this.form,
          headers: headers,
          autoLogin: false
        })
        await this.$auth.login({ data: {
          email: this.user.email,
          password: this.user.password
        }})
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
