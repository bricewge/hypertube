<template>
  <div class="usr-cntnr">
    <img v-bind:src='user.image_url'>
    <p>{{ user.firstname }} {{ user.name }}</p>
    <p>{{ user.login }}</p>
    <p>{{ user.age }}</p>
    <p>{{ user.password }}</p>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        name: 'Dwayne',
        firstname: 'Johnson',
        login: 'Dwayni-du-9-2',
        age: '18',
        email: 'dwayne.johnson@gmail.com',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/The_ROCK.jpg/170px-The_ROCK.jpg',
        password: '*********'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
