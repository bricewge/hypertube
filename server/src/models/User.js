const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8

  if (!user.changed('password')) {
    return
  }
  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      hooks: {
        beforeSave: hashPassword
      }
    },
    facebookId: {
      type: DataTypes.STRING
    },
    googleId: {
      type: DataTypes.STRING
    },
    fortyTwoId: {
      type: DataTypes.STRING
    },
    login: {
      type: DataTypes.STRING
    },
    firstname: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    image_url: {
      type: DataTypes.STRING
    },
    language: {
      type: DataTypes.STRING
    }
  })

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }

  User.associate = function (models) {
  }

  return User
}
