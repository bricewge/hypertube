const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/db')
const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
