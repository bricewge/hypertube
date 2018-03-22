const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {User} = require('./models')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var pass = require('./oauth.js')
console.log(User)
passport.use(new FacebookStrategy(pass.facebook,
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile)
    User.findOrCreate({ where: {facebookId: profile.id},
      defaults: {
        email: profile.emails[0].value,
        login: profile.username || profile.displayName,
        firstname: profile.givenName,
        name: profile.familyName,
        image_url: profile.picture
      }}, function (err, user) {
      return cb(err, user)
    })
  }
))

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.use(new GoogleStrategy(pass.google,
  function (accessToken, refreshToken, profile, cb) {
    var obj = { where: { googleId: profile.id },
      defaults: {
        email: 'lodnjfn'
      }
    }
    console.log(obj)
    User.findOrCreate(obj, function (err, user) {
      return cb(err, user)
    })
  }
))

var FortyTwoStrategy = require('passport-42').Strategy

passport.use(new FortyTwoStrategy(pass.fortyTwo,
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({where: { fortyTwoId: profile.id }}, function (err, user) {
      return cb(err, user)
    })
  }
))

require('./routes')(app, passport)
sequelize.sync()
  .then(() => {
    app.listen(config.port)
    console.log(`Serveur started on port ${config.port}`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
