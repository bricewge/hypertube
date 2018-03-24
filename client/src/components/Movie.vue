<template>
  <div class="movie-cntnr">
  <!-- <div class="movie-cntnr" style="background-image: " + {{ movie.image_url }} + ";"> -->
    <div class="left-cntnr">
      <img v-bind:src='movie.image_url'/>
    </div>
    <div class="rgt-cntnr">
      <h1>{{ movie.title }}</h1>
      <p class="description">{{ movie.year }} - {{ movie.duration }} min - {{ movie.type }}</p>
      <p class="synopsis">{{ movie.synopsis }}</p>
      <p>producteur: {{ movie.productor }}</p>
      <p>réalisateur: {{ movie.realisator }}</p>
      <br>
      <p>avec: {{ movie.actors }}</p>
      <button>Regarder maintenant <img src="../assets/video-camera-with-play-button.png"/></button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      movie: {
        image_url: 'https://cdn.amctheatres.com/production/2/movies/49000/48956/PosterDynamic/34928.jpg',
        title: 'Jumanji: Welcome to the jungle',
        year: '2017',
        duration: '119',
        type: 'family/action/aventure',
        synopsis: 'the tables are turned as four teenagers are sucked into Jumanji\'s world - pitted against rhinos, black mambas and an endless variety of jungle traps and puzzles. To survive, they\'ll play as characters of the game.',
        productor: 'Bwaegene',
        realisator: 'cde-laro',
        actors: 'vmontagn, tgauguet'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/application';
</style>
