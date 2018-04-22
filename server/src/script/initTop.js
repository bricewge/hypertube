const Search = require('../controllers/SearchController');
const {sequelize, Movie} = require('../models')

sequelize.sync()
  .then(() => {
    Search.search_best_movie_pirate_bay(
        async (values) => {
            //for (var i = 0; i < values.length; i++)
            //    var res = await Movie.create(values[i]);
			var lst = []
			for (var i = 0; i < values.length; i++)
			{
				var value = values[i];
				if (value["imdb_id"] && value["imdb_id"])
				{
					lst.push(value["imdb_id"]);
					Search.search_subtitle(value["imdb_id"], () => {});
				}
			}
			console.log(">", lst);
			Search.search_imdb_data_by_imdb_id_list(lst, (values) => {console.log("END!!!");process.exit(0);});
        }
    )
	// Search.search_subtitle("tt0357111", () => {console.log("END!!!");process.exit(0);});
//	  Search.search_imdb_data_by_imdb_id_list(tmp, (values) => {console.log("END!!!");process.exit(0);});
/*	Search.search_imdb_movie("pacific",
        async (values) => {
            console.log(values)
            for (var i = 0; i < values.length; i++)
                var res = await Movie.create(values[i]);
            process.exit(0);
        }
    )*/
}).then(() =>
{

})
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
