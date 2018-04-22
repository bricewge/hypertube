<template>
<div>
  <div>
    <div class="bck-cntnr" v-bind:style="{ backgroundImage: 'url(' + movie.image_url + ')' }"></div>
    <div class="main-cntnr">
      <div class="left-cntnr">
        <img :src="movie.image_url"/>
      </div>
      <div class="rgt-cntnr">
        <h1>{{ movie.title }}</h1>
        <p>{{ $t('casting') }}: {{ movie.casting }}</p>
        <p>{{ $t('director') }}: {{ movie.director }}</p>
        <p>{{ $t('producer') }}: {{ movie.producer }}</p>
        <p>{{ $t('rating') }}: {{ movie.rating }}</p>
        <p>{{ $t('year') }}: {{ movie.year }}</p>
        <p>{{ $t('summary') }}: {{ movie.summary }}</p>
        <!-- <p>{{ $t('duration') }}: {{ movie.length }}</p> -->
        <div class="video-cntnr player-cntnr" id="player">
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
  </div>
</div>
</template>

<script>
import Clappr from 'clappr'
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
        parentId: '#player',
        poster: response.data.image_url,
        hlsjsConfig: { xhrSetup: (xhr) => {
          xhr.withCredentials = true
          xhr.setRequestHeader('Authorization', `Bearer ${this.$auth.token()}`)
        }},
        events: {
          onPlay: function () {
            var container = this.core.getCurrentContainer()
            console.log(container.getPlaybackType())
            if (player._hasSeek) {
              return
            }
            player.seek(0)
            player._hasSeek = true
          },
          onEnded: function () {
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
  overflow: scroll;
}

.bck-cntnr {
  position: fixed;
  left: 0;
  background-size: cover;
  right: 0;
  width: 105vw;
  margin-left: -1em;
  height: 100vh;
  z-index: 0;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  margin-top: -4em;
}

.main-cntnr div{
  margin-top: 2em;
  padding: 2em;
}

.left-cntnr{
  flex: 1;
}

.rgt-cntnr{
  flex: 2;
  text-align: left;
}

.main-cntnr h1{
  font-weight: 500;
  font-size: 3vw;
}

.main-cntnr p{
  font-size: 1em;
  font-weight: 400;
}

.main-cntnr p:first-of-type{
  opacity: .6;
}

.left-cntnr img{
  width: 100%;
  height: auto;
}

button{
  margin-top: 5em;
}

.comment-cntnr{
  margin-bottom: 2em;
  background: rgba(0,0,0,.6);
}

.comment{
  display: block;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid $grey-txt;
  padding: .5em !important;
  margin: 0;
}

.comment:last-of-type{
  border: none;
}

.comment p{
  font-size: 1.3em;
  color: white;
  font-weight: 450;
  margin: .2em;
}

.comment p:first-of-type{
  font-size: 1em;
  font-weight: 300;
}
</style>
