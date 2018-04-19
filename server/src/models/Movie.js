module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    imdb_id: {
      type: DataTypes.STRING,
      unique: true
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    image_url: DataTypes.STRING,
    summary: DataTypes.TEXT,
    year: DataTypes.STRING,
    director: DataTypes.STRING,
    producer: DataTypes.STRING,
    casting: DataTypes.STRING,
    //duration_in_min: DataTypes.STRING,
    rating: DataTypes.STRING,
    //file_path: DataTypes.STRING
  })
  return Movie
}
