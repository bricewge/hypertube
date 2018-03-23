<template>
  <header>
    <div class="link-cntnr align-lft">
      <div><router-link to="/user"><img src="../assets/man-user.png"> </router-link></div>
      <div class="sort">Genre <img src="../assets/sort-down.png"/></div>
      <div class="sort">Trier par <img src="../assets/sort-down.png"/></div>
    </div>
    <div>
      <router-link to="/" ><img src="../assets/logo-small.png"/></router-link>
    </div>
    <div class="link-cntnr align-rgt">
      <div><router-link to="/login">Se Connecter</router-link></div>
      <div><router-link to="/movie">Show movie</router-link></div>
      <div><router-link to="/player">Player page</router-link></div>
      <div class="search">
        <img src="../assets/magnifying-glass.png"/>
        <input type="text" placeholder="Rechercher">
      </div>
      <div class="lang">
        <img src="../assets/united-kingdom.png">
        <img src="../assets/france.png" class="selected">
      </div>
      <div><router-link to="/user"><img src="../assets/logout-button.png"></router-link></div>
    </div>
  </header>
</template>

<script>
export default{

}
</script>

<style lang="scss" scoped>
  @import '../assets/css/application.scss';

  header{
    text-align: center;
    background: $dark;
    position: fixed;
    display: flex;
    width:100%;
    top:0;
    padding: .2em 2em;
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
    margin-top: -.2em;
    height: auto;
    opacity: .5;
    margin-left: .2em;
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
