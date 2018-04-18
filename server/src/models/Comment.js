module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.STRING
    }
  })

  Comment.associate = function (models) {
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Movie)
  }
  return Comment
}
