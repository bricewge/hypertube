module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    imdb_id: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    image_url: DataTypes.STRING,
    summary: DataTypes.TEXT,
    year_of_production: DataTypes.STRING,
    director: DataTypes.STRING,
    producer: DataTypes.STRING,
    casting: DataTypes.STRING,
    duration_in_min: DataTypes.STRING,
    rating: DataTypes.STRING,
    file_path: DataTypes.STRING
  })

  Movie.associate = function (models) {
    Movie.hasMany(models.Comment)
    Movie.hasMany(models.View)
  }

  return Movie
}
