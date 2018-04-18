<template>
<div class="hello">
  <br><br>
  <div v-if='loading' class="load">
    <img src='../assets/spinner.mov.gif'/>
  </div>
  <v-container fluid grid-list-lg>
    <v-form
      @submit.prevent="filter"
      >
      <v-layout wrap>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.title"
            label="Title"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.genre"
            label="Genre"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.rating.min"
            label="Rating min"
            type="number"
            step="any"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.rating.max"
            label="Rating max"
            type="number"
            step="any"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.year.min"
            label="Year min"
            mask="####"
            type="number"
            step="any"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4 md2>
          <v-text-field
            v-model="filter.year.max"
            label="Year max"
            mask="####"
            type="number"
            step="any"
            box
            ></v-text-field>
        </v-flex>
        <v-spacer/><v-spacer></v-spacer>
        <v-flex xs4 offset-xs8 md2 offset-md10>
          <v-select
            v-model="sort"
            @input="sortBy"
            :items="sorts"
            item-value="text"
            return-object
            :prepend-icon="sortIcon"
            :prepend-icon-cb="toggleOrder"
            label="Sort by"
            ></v-select>
        </v-flex>
      </v-layout>
    </v-form>

    <v-data-iterator
      content-tag="v-layout"
      row
      wrap
      :items="filteredMovies"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12 sm6 md4 lg3
        >
        <v-card>
          <router-link
            :to="`/player/${props.item.imdb_id}`"
            >
            <v-card-media
              :src="props.item.image_url"
              height="400px"
              >
            </v-card-media>
          </router-link>
          <v-card-title>
            <div>
              <div class="headline" v-text="props.item.userName"/>
              <span class="grey--text">
                <p>{{ props.item.title }}</p>
                <p>{{ props.item.year }} - {{ props.item.rating }}/10</p>
              </span>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      movies: [],
      loading: false,
      rowsPerPageItems: [6, 12, 18],
      pagination: {
        sortBy: 'points',
        descending: true,
        rowsPerPage: 12
      },
      filter: {
        title: '',
        genre: '',
        rating: {min: '', max: ''},
        year: {min:'', max: ''}
      },
      sort: 'Rating',
      sorts: [
        { text: 'Title', sort: 'title'},
        { text: 'Genre', sort: 'genre'},
        { text: 'Rating', sort: 'rating'},
        { text: 'Year', sort: 'year'},
      ],
      sortIcon: 'arrow_downward'
    }
  },

  async mounted () {
    this.loading = true
    let res = await this.axios.get('/movies')
    this.loading = false
    this.movies = res.data // .data.movies
    this.sortBy(this.sorts[2]) // By default sort by rating
    console.log(this.movies)
  },

  computed: {
    filteredMovies (input) {
      let movies = this.movies
      if (this.filter.title){
        movies = movies.filter(movie => movie.title.toLowerCase()
                               .includes(this.filter.title.toLowerCase()))
      }
      // TODO Waiting for support of genre in DB
      // if (this.filter.genre){
      //   movies = movies.filter(movie => movie.genre.toLowerCase()
      //                          .includes(this.filter.genre.toLowerCase()))
      // }
      let ratingMin = parseFloat(this.filter.rating.min) || 0
      if (ratingMin) movies = movies.filter(movie => movie.rating >= ratingMin)
      let ratingMax = parseFloat(this.filter.rating.max) || 0
      if (ratingMax) movies = movies.filter(movie => movie.rating <= ratingMax)
      // TODO Waiting for support of year in DB
      let yearMin = parseFloat(this.filter.year.min) || 0
      // if (yearMin) movies = movies.filter(movie => movie.year >= yearMin)
      // let yearMax = parseFloat(this.filter.year.max) || 0
      // if (yearMax) movies = movies.filter(movie => movie.year <= yearMax)
      return movies
    }
  },

  methods: {
    toggleOrder () {
      this.sortIcon = this.pagination.descending ? 'arrow_upward' : 'arrow_downward'
      this.pagination.descending = !this.pagination.descending
    },

    sortBy (input) {
      this.pagination.sortBy = input.sort
    },
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
