const {User} = require('../models')
const jwt = require('jsonwebtoken')
const { celebrate, Joi} = require('celebrate')
const config = require('../config/config')

function jwtSignUser (user) {
  return jwt.sign(
    // NOTE Do we always have thoses values set in all oauth methods??
    { login: user.login, email: user.email, id: user.id },
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
    // console.log(req)
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
      let user
      if (!req.user) {
        const {email, password} = req.body
        user = await User.findOne({
          where: {
            email: email
          }
        })
        // console.log(req.body, user)
        if (!user) throw new Error()
        if (!await user.comparePassword(password)) throw new Error()
        res.setHeader('Authorization', jwtSignUser(user))
        res.sendStatus(201)
      } else {
        // console.log(req.user)
        user = req.user
        res.redirect('http://localhost:8080/login?tkn=' + jwtSignUser(user))
      }

    } catch (err) {
      // console.log(err)
      res.status(400).send({
        error: 'Incorrect login credentials'
      })
    }
  },

  async authenticated (req, res, next) {
    try {
      const authHeader = req.get('Authorization')
      if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
        throw new Error()
      }
      const token = authHeader.substr(7)
      const decoded = jwt.verify(token, config.authentication.jwtSecret)
      req.email = decoded.email
      req.login = decoded.login
      req.id = decoded.id
      next()
    } catch (err) {
      // console.log(err)
      res.status(400).send({
        error: 'Invalid token'
      })
    }
  }
}
