module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    image_url: DataTypes.STRING,
    summary: DataTypes.TEXT,
    year_of_production: DataTypes.STRING,
    director: DataTypes.STRING,
    producer: DataTypes.STRING,
    casting: DataTypes.STRING,
    duration_in_min: DataTypes.STRING,
    rating: DataTypes.STRING
  })

  return Movie
}
