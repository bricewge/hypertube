const {Movie} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const movies = await Movie.findAll({
        limit: parseInt(req.query.limit) || 50
      })
      res.send(movies)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the movies'
      })
    }
  },
  async show (req, res) {
    try {
      const movies = await Movie.findById(req.params.movieId)
      res.status(200).send(movies)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the movie'
      })
    }
  },
  async post (req, res) {
    try {
      const movie = await Movie.create(req.body)
      res.status(201).send(movie)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the movie'
      })
    }
  }
}
