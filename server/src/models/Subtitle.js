module.exports = (sequelize, DataTypes) => {
  const Subtitle = sequelize.define('Subtitle', {
	imdb_id: {
		type: DataTypes.STRING,
		allowNull: false,
	},
    file_path: {
      type: DataTypes.STRING
    },
    language: {
      type: DataTypes.STRING,
	  allowNull: false
  },
  opensub_id: {
	  type: DataTypes.STRING,
	  unique: true,
	  allowNull: false
  },

  })
  Subtitle.associate = function (models) {
    Subtitle.belongsTo(models.Movie)
  }
  return Subtitle
}
