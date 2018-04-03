const {Comment} = require('../models')

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
      res.status(200).send(comments)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the comment'
      })
    }
  },
  async post (req, res) {
    try {
      const comment = await Comment.create(req.body)
      res.send(comment)
    } catch (err) {
      res.status(201).send({
        error: 'An error has occured trying to create the comment'
      })
    }
  }
}
