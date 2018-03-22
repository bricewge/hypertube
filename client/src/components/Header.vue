<template>
  <v-toolbar fixed>
    <v-toolbar-title to="register" class="mr-4">
      HyperTube
    </v-toolbar-title>
  <v-toolbar-items>
    <v-btn flat dark>
      Parcourir
    </v-btn>
  </v-toolbar-items>
  <v-spacer/>
  <v-toolbar-items
    v-if="!$store.state.isUserLoggedIn">
    <v-btn
      to="/login"
      flat
      dark>
      Se Connecter
    </v-btn>
    <v-btn
      to="/register"
      flat
      dark>
      S'inscrire
    </v-btn>
  </v-toolbar-items>
  <v-toolbar-items
    v-if="$store.state.isUserLoggedIn">
    <v-btn
      @click="logout"
      flat
      dark>
      Se déconnecter
    </v-btn>
  </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default{
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'root'
      })
    }
  }
}
</script>

<style scoped>
</style>
