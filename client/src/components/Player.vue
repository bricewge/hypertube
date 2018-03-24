<template>
  <div class="player-cntnr">
    <h1>{{ movie.title }}</h1>
    <!-- INSERT VIDEO PLAYER HERE -->
    <h3>Commentaires</h3>
    <div v-for='comment in comments' v-bind:key='comment'>
      <p>{{ comment.user_name }} - {{ comment.created_at }}</p>
      <p>{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      movie: {
        title: 'Pulp Fiction',
        movie_path: 'Path to movie'
      },
      comments: [
        {
          user_name: 'Josiane',
          content: 'Trop bien !!',
          created_at: 'Il y a 2 minutes'
        },
        {
          user_name: 'Philippe',
          content: 'Josiane, les femmes à la vaisselle !!!',
          created_at: 'Il y a 3M d\'années'
        }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../assets/css/application';
</style>
