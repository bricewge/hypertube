const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const path = require('path')

const app = express()
// const hash = '3F8F219568B8B229581DDDD7BC5A5E889E906A9B'
const hash = '88594AAACBDE40EF3E2510C47374EC0AA396C08E'
// const hash = '10EA57E365DB30BDEE0EE24C97D720DC8E0AAD5B' // MKV
// ce9156eb497762f8b7577b71c0647a4b0c3423e1 // MKV
const nativeFormats = ['webm', 'mp4']
const transcodeFormats = ['mkv', 'avi']

let torrentsDownloading = {}

app.listen(3000, () => console.log('Hypertube is listening on port 3000!'))

// TODO Delete torrent at startup based on ctime

// TODO Move this to app.js
const torrentsPath = path.join('/goinfre/', process.env.USER)
console.log(torrentsPath)

// TODO Handle errors correctly
// Get a stream from the cache, a file or download it
exports.get = function (req, res, next) {
  try {
    const infoHash = req.params.hash.toLowerCase()
    if (torrentsDownloading[infoHash]) {
      console.log('Here you go, it\'s already downloading')
      res.file = torrentsDownloading[infoHash]
      next()
    } else if (false) { // TODO Test if torrent is the db
      // fs.s
      next()
    } else {
      console.log('We will initiate a download in a short while')
      const engine = torrentStream(infoHash, {tmp: torrentsPath})
      engine.once('ready', () => selectFile(engine, res, next))
      engine.once('idle', () => torrentFinished(engine))
    }
  } catch (err) { next(err) }
}

exports.send = function (req, res, next) {
  const range = req.headers.range
  let head
  let start = 0
  let end = res.file.length - 1

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    start = parseInt(parts[0], 10)
    end = parts[1] ? parseInt(parts[1], 10) : end
    head = {
      'Content-Range': `bytes ${start}-${end}/${res.file.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end - start) + 1,
      'Content-Type': `video/${res.file.type}`
    }
    res.writeHead(206, head)
    req.range.start = start
    req.range.end = end
  } else {
    head = {
      'Content-Length': res.file.length,
      'Content-Type': `video/${res.file.type}`
    }
    res.writeHead(200, head)
  }
  // console.log(res.statusCode)
  const opts = {start, end}
  if (res.file.transcoded) {
    res.send('TODO: this should be transcoded')
  } else {
    const stream = res.file.createReadStream(opts)
    stream.pipe(res)
  }
}



// TODO use correnct param, NOT req.params.hash
app.get('/stream/:hash',
        exports.get,
        exports.send)



function selectFile (engine, res, next) {
  for (let i in engine.files) {
    let file = engine.files[i]
    file.type = path.extname(file.name).toLowerCase().substr(1)
    if (nativeFormats.includes(file.type)) file.transcode = false
    else if (transcodeFormats.includes(file.type)) file.transcode = true
    else continue
    // We don't want to stream a trailer instead of the movie
    if (!res.file || file.length > res.file.length) res.file = file
  }
  res.file.select()
  torrentsDownloading[engine.infoHash] = res.file
  res.file.engine = engine
  if (res.file.transcode) {
    res.file = transcode(res.file)
    res.file.type = 'mp4'
  }
  console.log(res.file.name, res.file.type)
  next()
}

function torrentFinished (infoHash) {
  const file = torrentsDownloading[infoHash]
  console.log(`Torrent ${infoHash} finished downloading`)
  if (file.transcode) {
    console.log('TODO It should be added to the db since it is a native format')
  }
  // Keep seeding the torrent to keep the swarm healthy
  const day = 24 * 60 * 60 * 1000
  setTimeout(() => {
    file.engine.destroy()
    delete torrentsDownloading[infoHash]
  },
  15 * day) // NOTE Over 23 days it overflow
}

function transcode (stream) {
  return ffmpeg(stream)
    .format('mp4')
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .outputOptions('-movflags faststart')
    // .save() // TODO Save transcode
    .on('progress', (progress) => {
      console.log('Processing: ' + progress)
    })
    .on('end', () => {
      console.log('file has been converted succesfully')
    })
    .on('error', (err, stdout, stderr) => {
      console.log('an error happened: ' + err.message, stdout, stderr)
    })
}
