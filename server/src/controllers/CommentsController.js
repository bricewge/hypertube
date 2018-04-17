const {Comment} = require('../models')
const {User} = require('../models')
const {Movie} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const comments = await Comment.findAll({
        limit: 100
      })
      res.status(200).send(comments)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the comments'
      })
    }
  },
  async show (req, res) {
    try {
      const comments = await Comment.findAll({where: {movie_id: req.params.movieId}})
      console.log(comments)
      res.status(200).send(comments)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the comment'
      })
    }
  },
  async post (req, res) {
    console.log(req.body)
    try {
      const comments = await Comment.create({
        user_id: parseInt(req.body.user_id),
        content: req.body.content,
        movie_id: parseInt(req.body.movie_id)
      })
      try {
        const user = await User.findById(req.body.user_id)
        try {
          const movie = await Movie.findById(req.body.movie_id)
          const res = {
            id: comments.dataValues.id,
            created_at: comments.dataValues.created_at,
            content: req.query.content,
            user: {
              login: user.login,
              id: user.id,
              image_url: user.image_url
            },
            movie: {
              id: movie.id,
              title: movie.title,
              content: movie.content,
              image_url: movie.image_url,
              summary: movie.summary,
              year_of_production: movie.year_of_production,
              director: movie.director,
              producer: movie.producer,
              casting: movie.casting,
              duration_in_min: movie.duration_in_min,
              rating: movie.rating
            }
          }
          console.log(res)
          res.send(res)
        } catch (err) {
          res.status(500).send({
            error: 'An error has occured trying to get the movie'
          })
        }
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to get the user'
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the comment'
      })
    }
  }
}
