const {User} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      const users = await User.findAll({
        limit: 100
      })
      res.status(200).send(users)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the users'
      })
    }
  },

  async self (req, res) {
    try {
      const user = await User.findOne({
        where: { email: req.email },
        attributes: ['login', 'email', 'name', 'firstname', 'language', 'image_url']
      })
      res.status(200).send({data: user.dataValues})
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the user'
      })
    }
  },

  async show (req, res) {
    try {
      const user = await User.findOne({
        where: {login: req.params.login},
        attributes: ['login', 'email', 'name', 'firstname', 'language', 'image_url']
      })
      res.status(200).send(user.dataValues)
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to fetch the user'
      })
    }
  },

  async post (req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send(user)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to create the user'
      })
    }
  }
}
