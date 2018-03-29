<template>
  <div class="main-cntnr">
    <div class="rgt-cntnr">
      <h2>Inscription</h2>
      <input name="email" label="Email" type="email" v-model="email" placeholder="Email">
      <input type="text" name="name" placeholder="Nom"/>
      <input type="text" name="firstname" placeholder="Prénom"/>
      <input type="text" name="login" placeholder="Login"/>
      <input name="password" label="Mot de passe" type="password" v-model="password" placeholder="Mot de passe"/>
      <input type="text" name="image" placeholder="Télécharger une image"/>
      <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
      <br>
      <button @click="register">S'inscrire</button>
    </div>
    <div class="lft-cntnr">
      <h2>Connexion</h2>
      <input name="email" type="email" v-model="email" placeholder="Email"/>
      <input name="password" type="password" v-model="password" placeholder="Mot de passe"/>
      <v-alert type="success" :value="succes" transition="scale-transition" v-html="succes"/>
      <v-alert type="error" :value="error" transition="scale-transition" v-html="error"/>
      <br>
      <button @click="login">Se connecter</button><br><br>
      <h2>Ou</h2>
      <router-link to='/auth/42'><button><img src='../assets/42.png'></button></router-link>
      <router-link to='/auth/facebook'><button><img src='../assets/facebook-letter-logo.png'></button></router-link>
      <router-link to='/auth/google'><button><img src='../assets/google-plus.png'></button></router-link>
    </div>
  </div>
<!-- <v-layout column>
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
</v-layout> -->

</template>

<script>
// ADD the feature to download images
// POST form informations on SUBMIT register
// POST form informations on SUBMIT login
// add token to user if logged in successfully
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

<style scoped lang='scss'>
@import '../assets/css/application.scss';

.main-cntnr{
  padding-top: 5em;
}

.main-cntnr .rgt-cntnr, .main-cntnr .lft-cntnr{
  display: inline-block;
  vertical-align: top;
  padding: 3em;
  margin: 0 1em;
  border-radius: .3em;
  text-align: center;
  background: $dark;
  width: 30em;
}

h2{
  color: $grey-txt;
  font-size: 1.8em;
  font-weight: 400;
}

input{
  font-size: 1.2em;
  background: $darker;
  display: block;
  border: 1px solid $black;
  width: 100%;
  box-sizing: border-box;
  margin:.6em 0;
  padding: .5em 1em;
  color: $white;
  border-radius: .3em;
}

::placeholder{
  color: $grey-txt;
}

button{
  width:100%;
  margin: .3em;
}

button img{
  margin: 0;
}

.lft-cntnr a:first-of-type button{
  background: $white;
}

.lft-cntnr a:nth-of-type(2) button{
  background: $facebook-blue;
}

.lft-cntnr a:nth-of-type(3) button{
  background: $google-red;
}
</style>
