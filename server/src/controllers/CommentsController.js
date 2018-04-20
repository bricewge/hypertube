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
      res.status(499).send({
        error: 'An error occured trying to fetch the comments'
      })
    }
  },
  validateShowComments: celebrate({
    params: Joi.object().keys({
      MovieImdbId: Joi.number().integer()
    })
  }
  ),
  async show (req, res) {
    try {
      const comments = await Comment.findAll({
        where: {MovieImdbId: req.params.MovieImdbId},
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
      res.status(499).send({
        error: 'An error occured trying to fetch the comment'
      })
    }
  },
  validatePostComments: celebrate({
    body: Joi.object().keys({
      user_id: Joi.number().integer(),
      movie_id: Joi.number().integer(),
      content: Joi.string().min(2).alphanum()
    })
  }),
  async post (req, res) {
    console.log(req.body)
    try {
      const comments = await Comment.create({
        UserId: parseInt(req.id),
        content: req.body.content,
        MovieImdbId: parseInt(req.body.movie_id)
      })
      console.log(comments)
      try {
        const user = await User.findById(req.id)
        try {
          const movie = await Movie.findById(req.body.movie_id)
          const result = {
            id: comments.dataValues.id,
            created_at: comments.dataValues.created_at,
            content: req.body.content,
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
              year_of_production: movie.year,
              director: movie.director,
              producer: movie.producer,
              casting: movie.casting,
              duration_in_min: movie.duration_in_min,
              rating: movie.rating
            }
          }
          console.log(result)
          res.send(result)
        } catch (err) {
          console.log(err)
          res.status(499).send({
            error: 'An error has occured trying to get the movie'
          })
        }
      } catch (err) {
        console.log(err)
        res.status(499).send({
          error: 'An error has occured trying to get the user'
        })
      }
    } catch (err) {
      console.log(err)
      res.status(499).send({
        error: 'An error has occured trying to create the comment'
      })
    }
  }
}
