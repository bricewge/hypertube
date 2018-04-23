<template>
  <div class="usr-cntnr">
    <div v-if='user.image_url'>
      <img v-bind:src='user.image_url'>
    </div>
    <p>{{ user.firstname }} {{ user.name }}</p>
    <p>{{ user.login }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  async mounted () {
    try {
      const response = await this.axios.get(`/users/${this.$route.params.login}`)
      this.user = response.data
    } catch (err) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/application';
.usr-cntnr{
  padding-top: 3em;
}

.usr-cntnr img{
  width: auto;
  border-radius: .5em;
  height: 20em;
}

.usr-cntnr p{
  margin: .3em;
  font-weight: 500;
  font-size: 1.2em;
  opacity: .8;
  color: $white;
}
</style>
