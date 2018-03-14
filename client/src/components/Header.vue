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
  <v-toolbar-items>
      <v-btn to="login" flat dark>
        Se Connecter
      </v-btn>
      <v-btn to="register" flat dark>
        S'inscrire
      </v-btn>
  </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default{

}
</script>

<style scoped>
</style>
