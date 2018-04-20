module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    imdb_id: {
      type: DataTypes.STRING,
      unique: true,
	  allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
	  allowNull: false,
    },
	content: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
	  allowNull: false,
    },
    summary: DataTypes.TEXT,
    year: {
      type: DataTypes.STRING,
	  allowNull: false,
    },
    director: DataTypes.STRING,
    producer: DataTypes.STRING,
    casting: DataTypes.STRING,
    //duration_in_min: DataTypes.STRING,
    rating: {
      type: DataTypes.STRING,
	  allowNull: false,
    },
    //file_path: DataTypes.STRING
  })

 //  Movie.associate = function (models) {
 //   Movie.hasMany(models.Torrent, {as: 'Torrent'})
 // }
  return Movie
}
