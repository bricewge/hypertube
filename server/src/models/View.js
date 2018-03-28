module.exports = (sequelize, DataTypes) => {
  const View = sequelize.define('View', {})

  View.associate = function (models) {
    View.belongTo(models.User)
    View.belongTo(models.Movie)
  }

  return View
}
