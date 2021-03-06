const {User} = require('../models')
const { celebrate, Joi } = require('celebrate')
const fs = require('fs')
const url = require('url')

module.exports = {
  async index (req, res) {
    try {
      const users = await User.findAll({
        limit: 100
      })
      res.status(200).send(users)
    } catch (err) {
      res.status(499).send({
        error: 'An error occured trying to fetch the users'
      })
    }
  },

  async self (req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.id },
        attributes: ['login', 'email', 'name', 'firstname', 'language', 'image_url']
      })
      //  console.log(req.id)
      res.status(200).send({data: user.dataValues})
    } catch (err) {
      //  console.log(err)
      res.status(499).send({

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
      res.status(499).send({
        error: 'An error occured trying to fetch the user'
      })
    }
  },

  validateUpdate: celebrate(
    {body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])([\w\-\.\_ ]+)$/).error(new Error('Password must have at least one lowercase, one uppercase, and one number')),
      name: Joi.string(),
      firstname: Joi.string(),
      login: Joi.string(),
      language: Joi.string().alphanum()
    })}),

  async update (req, res, next) {
    try {
      //  console.log(req.body)
      let values = {}
      for (let key in req.body) {
        if (req.body[key]) values[key] = req.body[key]
      }
      if (req.file) {
        const referer = new url.URL(req.headers.referer)
        referer.port = 8081
        values.image_url = url.resolve(referer.origin, req.file.path)
      }
      const query = {where: {id: req.id}}
      await User.update(values, query)
      //  console.log(values, req.file)
      res.sendStatus(201)
    } catch (err) {
      fs.unlinkSync(req.file.path)
      next(err)
    }
  },

  async post (req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send(user)
    } catch (err) {
      res.status(499).send({
        error: 'An error has occured trying to create the user'
      })
    }
  }
}
