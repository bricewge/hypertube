module.exports = (sequelize, DataTypes) => {
  const Subtitle = sequelize.define('Subtitle', {
    file_path: {
      type: DataTypes.STRING
    },
    language: {
      type: DataTypes.STRING
    }
  })
  Subtitle.associate = function (models) {
    Subtitle.belongTo(models.Movie)
  }
  return Subtitle
}
