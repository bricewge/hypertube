<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-toolbar flat dense class="red" dark>
          <v-toolbar-title>
            Inscription
          </v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
            name="email"
            label="Email"
            type="email"
            v-model="email" light>
          </v-text-field>
          <v-text-field
            name="password"
            label="Mot de passe"
            type="password"
            v-model="password" light>
          </v-text-field>
          <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
          <br>
          <v-btn
            class="red" dark
            @click="register">
            S'inscrire
          </v-btn>
        </div>
      </div>
      <div class="white elevation-2">
        <v-toolbar flat dense class="red" dark>
          <v-toolbar-title>
            Connexion
          </v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
            name="email"
            label="Email"
            type="email"
            v-model="email" light>
          </v-text-field>
          <v-text-field
            name="password"
            label="Mot de passe"
            type="password"
            v-model="password" light>
          </v-text-field>
          <v-alert type="success" :value="succes" transition="scale-transition" v-html="succes"/>
          <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
          <br>
          <v-btn
            class="red" dark
            @click="login">
            Se connecter
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
      succes: null
    }
  },
  methods: {
    async login () {
      try {
        await AuthenticationService.login({
          email: this.email,
          password: this.password,
          succes: 'ok'
        })
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  },
  watch: {
    email (value) {
      this.error = null
    },
    password (value) {
      this.error = null
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
