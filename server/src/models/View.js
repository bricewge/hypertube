module.exports = (sequelize, DataTypes) => {
  const View = sequelize.define('View', {})

  View.associate = function (models) {
    View.belongsTo(models.User)
    View.belongsTo(models.Movie)
  }

  return View
}
