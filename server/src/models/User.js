const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 8

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    facebookId: {
      type: DataTypes.STRING,
      unique: true
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true
    },
    fortyTwoId: {
      type: DataTypes.STRING,
      unique: true
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
    return bcrypt.compare(password, this.password)
  }

  User.beforeValidate(async (user, options) => {
    if (!user.password) return
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  })

  User.associate = function (models) {
  }

  return User
}
