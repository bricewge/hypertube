const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const passport = require('./passport.js')
const { errors } = require('celebrate')
const path = require('path')
const url = require('url')

const config = require('./config/config')
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// TODO Write middleware to manage ValidationError from celebration

const uploadPath = path.join(__dirname, '..', config.upload.dest)
app.use(url.resolve('/', config.upload.dest), express.static(uploadPath))

require('./routes')(app, passport)
app.use(errors())
sequelize.sync()
  .then(() => {
    app.listen(config.port)
    console.log(`Serveur started on port ${config.port}`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
