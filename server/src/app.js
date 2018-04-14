const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const {User} = require('./models')
const pass = require('./oauth.js')

const config = require('./config/config')
const app = express()
const passports = {
  passport: require('passport'),
  FacebookStrategy: require('passport-facebook').Strategy,
  GoogleStrategy: require('passport-google-oauth').OAuth2Strategy,
  FortyTwoStrategy: require('passport-42').Strategy
}
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// TODO Write middleware to manage ValidationError from celebration

passports.passport.use(new passports.FacebookStrategy(pass.facebook,
  (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile)
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

// require('./controllers/ExternAuthenticationController.js')(passports)
require('./routes')(app, passports.passport)
sequelize.sync()
  .then(() => {
    app.listen(config.port)
    console.log(`Serveur started on port ${config.port}`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
