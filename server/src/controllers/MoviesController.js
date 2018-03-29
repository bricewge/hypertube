const {Movie} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const movies = await Movie.findAll({
        limit: 100
      })
      res.send(movies)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the movies'
      })
    }
  },
  async post (req, res) {
    try {
      const movie = await Movie.create(req.body)
      res.send(movie)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the movie'
      })
    }
  }
}
