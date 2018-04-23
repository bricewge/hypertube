const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const passport = require('./passport.js')
const { errors } = require('celebrate')
const path = require('path')
const url = require('url')
const request = require('request')

const config = require('./config/config')
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const uploadPath = path.join(__dirname, '..', config.upload.dest)
app.use(url.resolve('/', config.upload.dest), express.static(uploadPath))
// NOTE Hackish proxy
app.use('/subs', function (req, res) {
  if (!req.url.includes('dl.opensubtitles.org')) res.sendStatus(400)
  var url = 'https:/' + req.url
  console.log(url)
  req.pipe(request(url)).pipe(res)
})

require('./routes')(app, passport)
app.use(errors())
require('./middlewares/errors')(app)
sequelize.sync()
  .then(() => {
    let server = app.listen(config.port)
    server.timeout = 10 * 60 * 1000
    console.log(`Serveur started on port ${config.port}`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
