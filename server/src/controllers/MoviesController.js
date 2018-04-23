const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const debug = require('debug')('movie')
const path = require('path')
const {Movie, Torrent, User, Comment, View} = require('../models')
const Search = require('./SearchController')
const Sequelize = require('Sequelize')
const Op = Sequelize.Op
const config = require('../config/config')

let torrents = {}

function clearViews (movies, id) {
  for (let i in movies) {
    let views = movies[i].Views
    for (let j in views) {
      if (id === views[j].id) {
        movies[i].dataValues.viewed = true
        break
      }
    }
    if (!movies[i].dataValues.viewed) movies[i].dataValues.viewed = false
    delete movies[i].dataValues.Views
  }
  return movies
}

module.exports = {
  async index (req, res) {
    try {
      if (req.query.q) {
        let movies = await Movie.findAll({
          limit: parseInt(req.query.limit) || 50,
          where: {
            title: {
              [Op.like]: "%" + req.query.q + "%"
            }
          },
          include: [{
            model: View
          }]
        })
        movies = clearViews(movies, req.id)
          if (movies.length === 0)
            Search.search_movie(req.query.q, async get_movies => {
				res.send(get_movies);
				for (var i = 0; i < get_movies.length; i++) {
					var movie = get_movies[i];
					var lst_movie = []
					if (!movie || !movie["imdb_id"])
						continue;
					let torrent = await Torrent.findOne({where: {imdb_id: movie["imdb_id"]}})
					if (!torrent)
					{
						lst_movie.push(movie["imdb_id"]);
					}
					console.log(movies);
					Search.search_torrent_by_imdb_id_list(lst_movie, () => {console.log("Search for " + req.query.q + "finished !")});
				}
			}, req.query.q)
          else
            res.send(movies);
      } else {
        let movies = await Movie.findAll({
          limit: parseInt(req.query.limit) || 50,
          include: [{
            model: View
          }]
        })
        movies = clearViews(movies, req.id)
        // console.log(movies)
        res.send(movies)
      }
    } catch (err) {
      console.log(err);
      res.status(499).send({
        error: 'An error occured trying to fetch the movies'
      })
    }
  },

  // TODO Return link to stream not file_path
  // TODO Create movie if it doesn't exists
  async show (req, res) {
    try {
      if (!req.params.movieId) throw new Error()
      let movie = await Movie.findOne({where: {imdb_id: req.params.movieId}, include: [{
        model: Comment,
        attributes: ['content'],
        include: [{
          model: User,
          attributes: ['login']
        }]
      }]
                                      })
      let torrent = await Torrent.findOne({where: {imdb_id: req.params.movieId}}) //TODO: edit
      res.movie = movie
      res.torrent = torrent
      console.log(movie)
      if (torrent && !torrent.file_path) {
         //TODO get other than first torrent
        let magnetLink = torrent.hash //getMagnetLink(req.params.movieId)
        //let magnetLink = hashes[0]
        const engine = torrentStream(
          magnetLink,
          {tmp: config.storage}
        )
        engine.once('ready', () => onEngineReady(engine, res, torrent))
        engine.once('idle', () => onEngineIdle(engine))
	    } else if (torrent) {
        movie.dataValues.url = '/streams/' + torrent.dataValues.hash.toLowerCase() + '.m3u8'
        res.status(200).send(movie)
	}
    } catch (err) {
      console.log(err)
      res.status(499).send({
        error: 'An error occured trying to fetch the movie'
      })
    }
  }
}

function onEngineReady (engine, res, torrent) {
  debug(`start downloading: ${engine.infoHash}`)
  for (let i in engine.files) {
    let file = engine.files[i]
    console.log(file.name)
    file.path = path.parse(file.name)
    file.type = file.path.ext.toLowerCase().substr(1)
    if (config.formats.native.includes(file.type)) file.transcoded = false
    else if (config.formats.transcode.includes(file.type)) {
      file.transcoded = true
      file.type = 'mp4'
    } else continue
    // We don't want to stream a trailer instead of the movie
    if (!res.file || file.length > res.file.length) res.file = file
  }
  // TODO Handle if no movies are found
  res.engine = engine
  res.file.select()
  debug(`selected file ${res.file.name} for ${engine.infoHash}`)
  res.file.path.full = path.join(config.storage, engine.infoHash + '.m3u8')
  let stream = res.file.createReadStream()
  transcode(stream, res.file.path.full, res)
  torrent.updateAttributes({
    file_path: res.file.path.full
  })
  // next()
  // TODO Store in DB | OK
}

function onEngineIdle (engine) {
  // We seed the torrent to keep the swarm healthy
  const day = 24 * 60 * 60 * 1000
  setTimeout(() => {
    engine.destroy()
  },
  15 * day) // NOTE Over 23 days it overflow
}

function transcode (streamIn, file, res) {
  const opts = [
    '-start_number 0', // start the first .ts segment at index 0
    '-hls_time 10', // 10 second segment duration
    '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
    '-hls_playlist_type vod',
    // '-hls_flags single_file',
    '-preset ultrafast'
  ]
  try {
    let title = false
    new ffmpeg(streamIn).addOptions(opts)
    .on('end', () => {
      console.log('file has been converted succesfully')
    })
    .on('error', (err, stdout, stderr) => {
      console.log('an error happened: ' + err.message, stdout, stderr)
    })
    .on('progress', (progress) => { console.log(`Frame ${progress.frames}`) })
    .on('progress', (progress) => {
      let timer = parseInt(progress.timemark.split(':')[1])
      if (!title) console.log(progress.timemark + " | " + timer)
      if (timer >= 2 && !title) {
        res.movie.dataValues.url = '/streams/' + res.engine.infoHash + '.m3u8'
        console.log(res.movie)
        res.status(200).send(res.movie)
        title = true
      }
  })
      .format('hls')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOption('-movflags frag_keyframe+faststart')
      .save(file)

  } catch (err) { console.log(err) }
}
