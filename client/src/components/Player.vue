<template>
  <div>
    <h1>{{ movie.title }}</h1>
    <div class="player-cntnr">
      <div class="video-cntnr">
        <iframe src="https://www.youtube.com/embed/yH4J2N3cUrw?rel=0;showinfo=0" frameborder="0" allowfullscreen=""></iframe>
      </div>
      <div class="comment-cntnr">
        <input type="text" name="comment" placeholder="Votre commentaire...">
        <div v-for='comment in comments' v-bind:key='comment' class="comment">
          <p>{{ comment.user_name }} - {{ comment.created_at }}</p>
          <p>{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
@import '../assets/css/application';

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
