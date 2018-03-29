<template>
  <div class="hello">
    <br><br>
    <div v-if='loading' class="load">
      <img src='../assets/spinner.mov.gif'/>
    </div>
    <div v-for='movie in movies' :key='movie' class="movie-cntnr">
      <img v-bind:src="movie.medium_cover_image"/>
      <p>{{ movie.title }}</p>
      <p>{{ movie.year }} - {{ movie.rating }}/10</p>
    </div>
  </div>
</template>

<script>
import HomeService from '@/service/HomeService'
var url = 'https://yts.am/api/v2/list_movies.json?limit=50&sort_by=title'

// GOALS :
// GET random data from BACK-END API, like 30 of each then get the next 30 and show them on scroll down
// !!!!!! OR get the complete array of movies and show only the first 30 then on scroll down etc.
// IF user use the search form ->
// POST value to back-end
// GET new array of movies
// LOAD selected movies (no page reload)
// IF USER use a filter (by title, kind, etc.) ->
// SORT All results by x and show them
// ON CLICK ON A MOVIE POST the movie name to the server and prepare to redirect to SHOW movie
export default {
  data () {
    return {
      movies: [],
      loading: false
    }
  },
  async mounted () {
    this.loading = true
    let res = await HomeService.getMoviesList(url)
    this.loading = false
    this.movies = res.data.data.movies
  }
}
</script>

<style scoped lang="scss">
@import '../assets/css/application.scss';
.movie-cntnr{
  display: inline-block;
  vertical-align: top;
  margin: .5em;
  padding: .5em;
  width: 16em;
}

.movie-cntnr img{
  width: 15em;
  cursor: pointer;
  border-radius: .5em;
  height: 22em;
  -webkit-box-shadow: 0px 0px 17px 7px rgb(6,7,7);
  -moz-box-shadow: 0px 0px 17px 7px rgb(6,7,7);
  box-shadow: 0px 0px 17px 7px rgb(6,7,7);
}

.movie-cntnr p{
  font-weight: 400;
  opacity: .8;
  margin: 0;
  font-size: 1em;
}

.movie-cntnr p:first-of-type{
  opacity: 1;
  color: $white;
  font-weight: 600;
  font-size: 1.2em;
}

.load img{
  width: 5em;
  opacity: .5;
}
</style>
