<template>
  <div class="usr-cntnr">
    <!-- TODO Handle where there is no image set -->
    <img v-bind:src='user.image_url'>
    <p>{{ user.firstname }} {{ user.name }}</p>
    <p>{{ user.login }}</p>
    <!-- <p>{{ user.age }}</p> -->
    <p>password</p>
  </div>
</template>

<script>
// GET current user informations or user informations based on his ID
// TODO Use a form  to modify user data
export default {
  data () {
    return {
      user: {}
    }
  },

  async mounted () {
    const response = await this.axios.get(`/users/${this.$route.params.login}`)
    this.user = response.data
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
