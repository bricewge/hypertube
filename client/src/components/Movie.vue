<template>
  <div>
    <div class="movie-cntnr">
      <div class="bck-cntnr" v-bind:style="{ backgroundImage: 'url(' + movie.image_url + ')' }"></div>
      <div class="main-cntnr">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/css/application';

.main-cntnr{
  display: flex;
  width: 100%;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  background: rgba(25,26,28,.7);
}

.bck-cntnr {
  position: fixed;
  left: 0;
  background-size: cover;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}

.main-cntnr div{
  margin-top: 4em;
  padding: 2em;
}

.main-cntnr .left-cntnr{
  flex: 1;
}

.main-cntnr .rgt-cntnr{
  flex: 2;
  text-align: left;
}

.main-cntnr h1{
  font-weight: 500;
  font-size: 3vw;
}

.main-cntnr p{
  font-size: 1.2em;
  font-weight: 400;
}

.main-cntnr p:first-of-type{
  opacity: .6;
}

.main-cntnr .left-cntnr img{
  width: 100%;
  height: auto;
}

button{
  margin-top: 5em;
}
</style>

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
