const {User} = require('../models')
const jwt = require('jsonwebtoken')
const { celebrate, Joi, errors } = require('celebrate')
const config = require('../config/config')

function jwtSignUser (user) {
  return jwt.sign(
    { login: user.login },
    config.authentication.jwtSecret,
    {expiresIn: '30d'}
  )
}

module.exports = {
  validateRegister: celebrate(
      {body: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().min(8),
        name: Joi.string().alphanum(),
        firstname: Joi.string().alphanum(),
        login: Joi.string().alphanum(),
        image: Joi.any().optional() // TODO Verify image
      })},
      {presence: 'required'}),

  async register (req, res) {
    try {
      const user = await User.create(req.body)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },

  // TODO Write valdiator
  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      console.log(req.body, user)
      if (!user) throw new Error()
      if (! await user.comparePassword(password)) throw new Error()
      console.log(user)

      res.setHeader('Authorization', jwtSignUser(user))
      res.sendStatus(201)
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'Incorrect login credentials'
      })
    }
  }
}
