const Search = require('../controllers/SearchController');
const {sequelize, Movie} = require('../models')

sequelize.sync()
  .then(() => {
      console.log("go");
    Search.search_best_movie(
        async (values) => {
            for (var i = 0; i < values.length; i++)
                var res = await Movie.create(values[i]);
            process.exit(0);
        }
    )
}).then(() =>
{

})
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
