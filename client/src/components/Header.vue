<template>
  <v-toolbar fixed class="test">
    <header>
      <div class="link-cntnr">
        <v-btn to="user" flat dark>Show user</v-btn>
      </div>
      <router-link to="/" ><img src="../assets/logo-small.png"/></router-link>
      <div class="link-cntnr">
        <v-btn to="login" flat dark>Se Connecter</v-btn>
        <v-btn to="movie" flat dark>Show movie</v-btn>
        <v-btn to="play" flat dark>Player page</v-btn>
      </div>
    </header>
  </v-toolbar>
</template>

<script>
export default{

}
</script>

<style lang="scss" scoped>
  @import '../assets/css/application.scss';

  .link-cntnr{
    background: green;
  }

</style>
