module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.BIGINT
    },
    movie_id: {
      type: DataTypes.BIGINT
    }
  })
  return Comment
}
