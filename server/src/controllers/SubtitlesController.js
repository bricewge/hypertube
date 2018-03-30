const {Subtitle} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const subtitles = await Subtitle.findAll({
        limit: 100
      })
      res.send(subtitles)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the subtitles'
      })
    }
  },
  async show (req, res) {
    try {
      const subtitles = await Subtitle.findAll({where: {movie_id: req.params.movieId}})
      res.send(subtitles)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the subtitles'
      })
    }
  },
  async post (req, res) {
    try {
      const subtitles = await Subtitle.create(req.body)
      res.send(subtitles)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the subtitles'
      })
    }
  }
}
