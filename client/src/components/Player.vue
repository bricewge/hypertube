<template>
<div>
  <h1>{{ movie.title }}</h1>
  <div class="player-cntnr">
    <div class="video-cntnr" id="player">
    </div>
      <p>Casting: {{ movie.casting }}</p>
      <p>Director: {{ movie.director }}</p>
      <p>Producer: {{ movie.producer }}</p>
      <p>Rating: {{ movie.rating }}</p>
      <p>Year: {{ movie.year }}</p>
      <p>Summary: {{ movie.summary }}</p>
      <!-- <p>Duration: {{ movie.length }}</p> -->
    <div>
    </div>
    <div class="comment-cntnr">
      <input v-model="comment"
             @keyup.enter="submitComment"
             type="text"
             name="comment"
             :placeholder="$t('your-comment')">
      <div v-for='(comment, index) in comments' v-bind:key='index' class="comment">
        <router-link :to="/user/ + comment.User.login">
          <p>{{ comment.User.login }}</p>
        </router-link>
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {

  data () {
    return {
      movie: {},
      comments: [],
      comment: '',
      player: null
    }
  },

  async mounted () {
    try {
      if (!this.$route.params.imdbId) return
      let test = await this.axios.post('/views', {MovieImdbId: this.$route.params.imdbId})
      console.log(test)

      const response = await this.axios.get(`/movies/${this.$route.params.imdbId}`)
      this.movie = response.data
      this.comments = response.data.Comments

      this.player = new Clappr.Player({
        source: '/api' + response.data.url,
        parentId: "#player",
        poster: response.data.image_url,
        hlsjsConfig: { xhrSetup: (xhr) => {
          xhr.withCredentials = true
          xhr.setRequestHeader('Authorization', `Bearer ${this.$auth.token()}`)
        }},
        events: {
          onPlay: function() {
            var container = this.core.getCurrentContainer()
            console.log(container.getPlaybackType())
            if (player._hasSeek) {
              return
            }
            player.seek(0);
            player._hasSeek = true;
          },
          onEnded: function() {
            // TODO Send as viewed
            console.log('Viewed')
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  },

  async unmounted () {
    if (this.player) this.player.destroy()
  },

  methods: {
    async submitComment () {
      try {
        await this.axios.post('/comments', {
          content: this.comment,
          imdb_id: this.$route.params.imdbId
        })
        let comment = {content: this.comment, User: {login: this.$auth.user().login}}
        this.comments.push(comment)
        this.comment = ''
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../assets/css/application';

/* TODO use it */
.player-cntnr{
    width: 60%;
    margin: 2em auto;
    background: $dark;
    padding: 2em;
}

h1{
    color: $grey-txt;
    font-size: 1.5vw;
    font-weight: 500;
    margin: 1em;
}

/* TODO use it */
.video-cntnr{
    margin-bottom: 2em;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;
}

.video-cntnr iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.comment{
  display: block;
  width: 100%;
  text-align: left;
  border-bottom: 2px solid $darker;
}

.comment:last-of-type{
  border: none;
}

.comment p{
  font-size: 1.3em;
  color: $grey-txt;
  font-weight: 450;
  margin: .5em;
}

.comment p:first-of-type{
  font-size: 1em;
  font-weight: 300;
}

.comment-cntnr input{
  border: 1px solid $black;
  background: $darker;
  padding: .6em 3em;
  width: 100%;
  margin-bottom: 2em;
  border-radius: .3em;
  font-size: 1.2em;
  box-sizing: border-box;
}
</style>
