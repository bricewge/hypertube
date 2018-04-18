<template>
  <header>
    <div v-if="$auth.check()" class="link-cntnr align-lft">
      <div><router-link to="/account"><img src="../assets/man-user.png"> </router-link></div>
    </div>
    <div>
      <router-link to="/" ><img src="../assets/logo-small.png"/></router-link>
    </div>
    <div class="link-cntnr align-rgt">
      <!-- THESE LINKS WILL BE REMOVED -->
        <div><router-link to="/movie">Show movie</router-link></div>
      <!-- END -->
      <div class="lang">
        <img src="../assets/smurf.png" @click="setLang('st')" />
        <img src="../assets/china.png" @click="setLang('cn')" />
        <img src="../assets/united-kingdom.png" @click="setLang('en')" />
        <img src="../assets/france.png" @click="setLang('fr')" />
      </div>
      <div v-if="$auth.check()">
        <router-link to="/user">
          <img @click="$auth.logout()" src="../assets/logout-button.png">
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
// ADD A FORM to select the current language
export default{
  methods: {
    setLang (lang) {
      this.$store.dispatch('setLang', lang)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/application.scss';

  header{
    text-align: center;
    background: $dark;
    border: 2px solid $darker;
    position: fixed;
    display: flex;
    width:100%;
    z-index: 50;
    top:0;
    padding: .2em 2em;
    -webkit-box-shadow: 0px 16px 24px -3px rgba(18,18,20,1);
    -moz-box-shadow: 0px 16px 24px -3px rgba(18,18,20,1);
    box-shadow: 0px 16px 24px -3px rgba(18,18,20,1);
  }

  header .link-cntnr div{
    display: inline-block;
    vertical-align: top;
    margin-top: .9em;
  }

  header .link-cntnr img{
    height: 2em;
    opacity: .5;
  }

  header .link-cntnr img:hover{
    opacity: .7;
  }

  header .link-cntnr .sort img{
    height: .8em;
    vertical-align: -.1em;
    margin-left: .4em;
    opacity: .3;
  }

  header .link-cntnr .sort{
    color: $grey-txt;
    margin-left: 1em;
    padding: .3em;
  }

  header .link-cntnr .sort img:hover{
    opacity: .5;
  }

  header img{
    height: 3.5em;
  }

  header img, header .link-cntnr{
    flex: 1;
  }

  .align-lft{
    text-align: left;
  }

  .align-rgt{
    text-align: right;
  }

  header .lang{
    margin: 0 2em;
  }

  header div .lang img{
    width: 2.3em;
    border-radius: .2em;
    margin-top: .1em;
    height: auto;
    opacity: .5;
    margin-left: .2em;
    cursor: pointer;
  }

  header div .lang .selected{
    opacity: 1;
  }

  header .search{
    margin-left: 2em;
  }

  header .search input[type="text"]{
    background: $darker;
    padding: .3em 1em .3em 2.5em;
    border-radius: 1.2em;
    border: 1px solid $black;
  }

  header .search img{
    position: absolute;
    width: 1em;
    height: auto;
    margin-top: .6em;
    margin-left: .8em;
  }

  header .search input[type="text"]:focus{
    border: 1px solid $grey-txt;
  }

  ::placeholder{
    color: $grey-txt;
  }
</style>
