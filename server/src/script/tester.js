`const Search = require('../controllers/SearchController');
const {sequelize, Movie} = require('../models')

sequelize.sync({force: true})
  .then(() => {
	  Search.search_movie_pirate_bay_by_imdb_id("tt1663662", async (values) => {console.log(values);
		  Search.search_movie_pirate_bay_by_imdb_id("tt1663662", async (values) => {console.log(values);})
	  })
/*	Search.search_imdb_movie("pacific",async (values) => {
			console.log(values)
            for (var i = 0; i < values.length; i++)
                var res = await Movie.create(values[i]);
            process.exit(0);
        }
    )*/
}).then(() =>
{
/*	Search.search_movie("pacific",async (values) => {console.log(values);
		Search.search_movie("pacific",async (values) => {console.log(values);
		});
	});*/
	//Search.search_movie_yts_by_imdb_id("tt1663662", async (values) => {console.log(values);})
}).then(() => {
			//console.log("stop");
			//process.exit(0);

})
  .catch(err => {
    console.error('Unable to connect to the database:', err)
})*/`

const OpenSubtitles = require('opensubtitles-api');
const OS = new OpenSubtitles("TemporaryUserAgent");
OS.search({
    imdbid: 'tt0357111',
	extensions: ['srt'],
}).then(subtitles => {console.log(subtitles) });
