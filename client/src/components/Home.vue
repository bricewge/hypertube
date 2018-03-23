<template>
  <div class="hello">
    <h1 dark> -> {{ movies }}</h1>
    <h2>Essential Links</h2>
    <h1 dark> -> {{ movies }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      movies: JSON.parse('https://yts.am/api/v2/list_movies.json')
    }
  },
  methods: {
    getMoviesList () {
      return 'test'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
