const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const pass = require('../oauth.js')

/* function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
} */

export default (passports) => {
  async function FacebookConnect () {
    passports.passport.use(new passports.FacebookStrategy(pass.facebook,
      (accessToken, refreshToken, profile, cb) => {
        var obj = { where: {facebookId: profile.id},
          defaults: {
            email: profile.emails[0].value,
            login: profile.username || profile.displayName,
            firstname: profile.givenName,
            name: profile.familyName,
            image_url: profile.picture
          }
        }
        User.findOrCreate(obj).then(function (user, err) {
          if (err) {
            console.log(err)
          } else {
            console.log(user)
          }
        })
      }
    ))
  }
  async function GoogleConnect () {
    passports.passport.use(new passports.GoogleStrategy(pass.google,
      (accessToken, refreshToken, profile, cb) => {
        var obj = { where: {googleId: profile.id},
          defaults: {
            email: profile.emails[0].value,
            login: profile.username || profile.displayName,
            firstname: profile.givenName,
            name: profile.familyName,
            image_url: profile.picture
          }}
        User.findOrCreate(obj, function (err, user) {
          cb(err, user)
        })
      }
    ))
  }
  async function FortyTwoConnect () {
    passports.passport.use(new passports.FortyTwoStrategy(pass.fortyTwo,
      (accessToken, refreshToken, profile, cb) => {
        var obj = { where: {fortyTwoId: profile.id},
          defaults: {
            email: profile.emails[0].value,
            login: profile.username || profile.displayName,
            firstname: profile.givenName,
            name: profile.familyName,
            image_url: profile.picture
          }}
        User.findOrCreate(obj).then(function (err, user) { cb(err, user) })
      }
    ))
  }
  FacebookConnect()
  GoogleConnect()
  FortyTwoConnect()
}
