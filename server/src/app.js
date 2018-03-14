const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js');

passport.use('facebook', new FacebookStrategy({
      clientID        : config.facebook.clientID,
      clientSecret    : config.facebook.clientSecret,
      callbackURL     : config.facebook.callbackURL,
      profileFields: ['id', 'emails', 'name']
    },

    function(access_token, refresh_token, profile, done) {
      process.nextTick(function() {
        Account.findOne({ 'username' : profile.emails[0].value }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            if (err)
              return done(err);
            else
              return done(null, user);
          } else {
            if (err)
              return done(err);

            Account.register(new Account({ username : profile.emails[0].value }), profile.id, function(err, account) {
              if (err)
                return done(err);
              else
                return done(null, account);
            });
          }
        });
      });
    }
));

sequelize.sync()
  .then(() => {
    app.listen(config.port)
    console.log(`Serveur started on port ${config.port}`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
