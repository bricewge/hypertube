const {User} = require('../models')
const jwt = require('jsonwebtoken')
const { celebrate, Joi } = require('celebrate')
const config = require('../config/config')
const nodemailer = require('nodemailer')
const Promise = require('bluebird')
const crypto = Promise.promisifyAll(require('crypto'))
const url = require('url')
const transporter = nodemailer.createTransport({
  sendmail: true,
  ignoreTLS: true
})

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
      image: Joi.object({ pipe: Joi.func() }).unknown()
    })},
    {presence: 'required'}),

  async register (req, res) {
    try {
      let values = {}
      for (let key in req.body) {
        if (req.body[key]) values[key] = req.body[key]
      }
      if (req.file) {
        const referer = new url.URL(req.headers.referer)
        referer.port = 8081
        values.image_url = url.resolve(referer.origin, req.file.path)
      }

      const user = await User.create(values)
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
      console.log(req.body, req.user)
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
      // This is when used with OAuth2
      } else {
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
  },

  validateForgotPassword: celebrate(
    {body: Joi.object().keys({
      email: Joi.string().email()
    })},
    {presence: 'required'}),

  async forgotPassword (req, res, next) {
    try {
      const query = {where: {email: req.body.email}}
      const user = await User.findOne(query)
      // console.log(user)
      if (!user) throw new Error('Invalid email')
      let token = await crypto.randomBytesAsync(20)
      token = token.toString('hex')
      await User.update({resetPasswordToken: token}, query)
      transporter.sendMail({
        to: user.dataValues.email,
        subject: 'Hypertube password reset',
        html: `<p>To reset your password follow this
               <a href="${req.headers.origin}/reset/${token}">link</a>.
               </p>`
      })
      res.json({message: `An email has been send to ${user.email}`})
    } catch (err) {
      next(err)
    }
  },

  validateResetPassword: celebrate(
    {body: Joi.object().keys({
      password: Joi.string().min(8),
      resetPasswordToken: Joi.string().min(20)
    })},
    {presence: 'required'}),

  async resetPassword (req, res, next) {
    try {
      const query = {where: {resetPasswordToken: req.body.resetPasswordToken}}
      let result = await User.findOne(query)
      if (!result ||
          req.body.resetPasswordToken !== result.resetPasswordToken) {
        throw new Error('Invalid token')
      }
      result = await User.update({
        password: req.body.password,
        resetPasswordToken: null
      }, query)
      res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  }
}
