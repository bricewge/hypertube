<template>
  <v-layout column>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
            This page will display a selected movies
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
