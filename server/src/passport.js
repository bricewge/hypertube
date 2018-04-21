const pass = require('./oauth.js')
const {User} = require('./models')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FortyTwoStrategy = require('passport-42').Strategy

// TODO Verify that all the defaults variabe are accecible.
//   If there is no passowrd, etc...
// TODO Make it in one function

passport.use(new FacebookStrategy(pass.facebook,
  async (accessToken, refreshToken, profile, cb) => {
    try {
      if (!profile._json.email) throw new Error('no email')
      const lang = profile._json.locale ? profile._json.locale.substr(0, 2) : null
      const photo = profile.photos[0] ? profile.photos[0].value : null
      const query = { where: {facebookId: profile.id},
        defaults: {
          email: profile._json.email,
          login: profile._json.name,
          facebookId: profile.id,
          firstname: profile._json.first_name,
          name: profile._json.last_name,
          image_url: photo,
          language: lang
        }
      }
      const result = await User.findOrCreate(query)
      cb(null, result[0].dataValues)
    } catch (err) {
      cb(err.message)
    }
  }
))

passport.use(new GoogleStrategy(pass.google,
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const query = { where: {googleId: profile.id},
        defaults: {
          email: profile.emails[0].value,
          googleId: profile.id,
          login: profile.displayName,
          firstname: profile.name.familyName,
          name: profile.name.givenName,
          image_url: profile.photos[0].value
        }}
      const result = await User.findOrCreate(query)
      console.log(profile, result)
      cb(null, result[0].dataValues)
    } catch (err) {
      cb(err.message)
    }
  }
))

passport.use(new FortyTwoStrategy(pass.fortyTwo,
  async (accessToken, refreshToken, profile, cb) => {
    try {
      // TODO Fix, double user creation
      const query = { where: {fortyTwoId: profile.id},
        defaults: {
          email: profile._json.email,
          fortyTwoId: profile.id,
          login: profile.username,
          firstname: profile._json.first_name,
          name: profile._json.last_name,
          image_url: profile._json.image_url
        }}
      User.findOrCreate(query)
      const result = await User.findOrCreate(query)
      // console.log(result)
      cb(null, result[0].dataValues)
    } catch (err) {
      // console.log(err)
      cb(err.message)
    }
  }
))

module.exports = passport
