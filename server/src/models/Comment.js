module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.STRING
    }
  })

  Comment.associate = function (models) {
    Comment.belongTo(models.User)
    Comment.belongTo(models.Movie)
  }
  return Comment
}
