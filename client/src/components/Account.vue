<template>
<v-container fluid fill-height>
  <v-layout row wrap>
    <v-flex xs12 sm10 md8>
      <div class="usr-cntnr">
        <img :src="$auth.user().image_url">
      </div>
      <v-form
        v-model="valid"
        ref="form"
        @submit.prevent="submit"
        lazy-validation>
        <v-text-field
          name="firstName"
          v-model="user.firstname"
          :placeholder="$t('firstname')"/>
        <v-text-field
          name="name"
          type="name"
          v-model="user.name"
          :placeholder="$t('name')"/>
        <v-text-field
          name="login"
          v-model="user.login"
          :placeholder="$t('login')"/>
        <v-text-field
          name="email"
          type="email"
          :rules="emailRules"
          v-model="user.email"
          :placeholder="$t('email')"/>
        <v-text-field
          name="password"
          type="password"
          :rules="passwordRules"
          v-model="user.password"
          :placeholder="$t('password')"/>
       <input
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          @change="onFilePicked"
          placeholder="Image"/>
        <v-btn
          type="submit"
          color="primary"
          >Update</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import {validPassword, validEmail} from '@/util/validation'

export default {
  data () {
    return {
      user: {
        firstname: this.$auth.user().firstname,
        name: this.$auth.user().name,
        login: this.$auth.user().login,
        email: this.$auth.user().email,
        password: '',
        image: null
      },
      form: new FormData(),
      emailRules: [ validEmail ],
      passwordRules: [ validPassword ],
      valid: true
    }
  },

  methods: {
    onFilePicked ($event) {
      if ($event.target.files.length) {
        this.user.image = $event.target.files[0]
      }
    },

    async submit () {
      if (!this.$refs.form.validate()) return
      for (let key in this.user) {
        if (this.user[key]) this.form.set(key, this.user[key])
        else this.form.delete(key)
      }
      // for(const pair of this.form.entries()) {
      //   console.log(pair[0]+ ', '+ pair[1]);
      // }
      // if (!data.length) return
      const config = {headers: {'content-type': 'multipart/form-data'}}
      await this.axios.put('/account', this.form, config)
      await this.$auth.fetch() // Get new account settings
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/application';
.usr-cntnr{
    padding-top: 3em;
}

.usr-cntnr img{
    width: 20em;
    height: 20em;
    border-radius: 50%;
}

.usr-cntnr p{
    margin: .3em;
    font-weight: 500;
    font-size: 1.2em;
    opacity: .8;
    color: $white;
}
</style>
