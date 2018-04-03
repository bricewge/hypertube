const {View} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const views = await View.findAll({
        limit: 50
      })
      res.status(200).send(views)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the views'
      })
    }
  },
  async show (req, res) {
    try {
      const views = await View.findAll({where: {movie_id: req.params.movieId}})
      res.status(200).send(views)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the view'
      })
    }
  },
  async post (req, res) {
    try {
      const view = await View.create(req.body)
      res.status(201).send(view)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the view'
      })
    }
  }
}
