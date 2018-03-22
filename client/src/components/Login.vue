<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-toolbar flat dense class="red" dark>
          <v-toolbar-title>
            Connexion
          </v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <form
            name="connexion"
            autocomplete="off"
            ><v-text-field
              name="email"
              label="Email"
              type="email"
              v-model="email" light>
            </v-text-field>
            <v-text-field
              name="password"
              label="Mot de passe"
              type="password"
              v-model="password"
              autocomplete="new-password" light>
            </v-text-field>
          </form>
          <v-alert type="success" :value="success" icon="new_releases" transition="scale-transition" v-html="success"/>
          <v-alert type="error" :value="error" icon="warnign" transition="scale-transition" v-html="error"/>
          <br>
          <v-btn
            class="red" dark
            @click="login">
            Se connecter
          </v-btn>
          <v-btn to="/auth/facebook" class="blue">
            facebook
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import AuthenticationService from '@/service/AuthenticationService'
export default {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
