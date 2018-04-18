const {Comment} = require('../models')
const {User} = require('../models')
const {Movie} = require('../models')
const { celebrate, Joi, errors } = require('celebrate')

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
  validateShowComments: celebrate({
    params: Joi.object().keys({
      movieId: Joi.number().integer()
    })
  }
  ),
  async show (req, res) {
    try {
      const comments = await Comment.findAll({
        where: {MovieId: req.params.movieId},
        include: [{
          model: User,
          through: {
            attribute: ['login']
          }
        }]
      })
      console.log(comments)
      res.status(200).send(comments)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error occured trying to fetch the comment'
      })
    }
  },
  validatePostComments: celebrate({
    body: Joi.object().keys({
      UserId: Joi.number().integer(),
      MovieId: Joi.number().integer(),
      content: Joi.string().min(2).alphanum()
    })
  }),
  async post (req, res) {
    console.log(req.body)
    try {
      const comments = await Comment.create({
        UserId: parseInt(req.body.user_id),
        content: req.body.content,
        MovieId: parseInt(req.body.movie_id)
      })
      try {
        const user = await User.findById(req.body.UserId)
        try {
          const movie = await Movie.findById(req.body.MovieId)
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
