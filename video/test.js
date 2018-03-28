const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const path = require('path')
// const http = require('http')

// const hash = '3F8F219568B8B229581DDDD7BC5A5E889E906A9B'
const hash = '88594AAACBDE40EF3E2510C47374EC0AA396C08E'
// const hash = '10EA57E365DB30BDEE0EE24C97D720DC8E0AAD5B' // MKV
const nativeFormats = ['webm', 'mp4']
const transcodeFormats = ['mkv', 'avi']
// Stop the process with Ctrl+c
// process.once('SIGINT', function () {
//   process.kill(process.pid, 'SIGINT')
// })

// let server = http.createServer()
let app = express()
let torrentsDownloading = {}

app.listen(3000, () => console.log('Hypertube is listening on port 3000!'))

app.get('/stream/:hash', streamTorrent)

// TODO Handle errors correctly
function streamTorrent (req, res, next) {
  try {
    if (false) { // TODO Test if torrent is the db
      // TODO Get the stream from a file
    } else if (torrentsDownloading[req.params.hash]) {
      console.log('Here you go, it\'s already downloading')
      stream(req, res, torrentsDownloading[req.params.hash])
    } else {
      console.log('We will initiate a download in a short while')
      const engine = torrentStream(req.params.hash)
      engine.once('ready', () => downloadVideo(req, res, engine.files))
      engine.once('idle', () => keepSeeding(req.params.hash, engine))
    }
  } catch (err) { next(err) }
}

// TODO Do something when the subtitles are downloaded
function downloadVideo (req, res, files) {
  // console.log(files)
  for (let i in files) {
    let file = files[i]
    file.type = path.extname(file.name).toLowerCase().substr(1)
    console.log(file.name, file.type)
    if (file.type === 'srt') {
      file.select()
      continue
    }
    if (nativeFormats.includes(file.type)) {
      stream(req, res, file)
      torrentsDownloading[req.params.hash] = file
    } else if (transcodeFormats.includes(file.type)) {
      file.type = 'mp4'
      // file.type = 'ogg'
      stream(req, res, file)
    }
  }
  console.log('end of onEngineReady')
}

function keepSeeding (hash, engine) {
  const day = 24 * 60 * 60 * 1000
  console.log(`Torrent ${hash} finished downloading`)
  setTimeout(() => {
    delete torrentsDownloading[hash]
    engine.destroy()
  },
  15 * day) // NOTE Over 23 days it overflow
}

function stream (req, res, file) {
  const range = req.headers.range
  let head = {}
  let responseCode = null
  let streamOpts = {}

  // console.log('we will stream')
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
    head = {
      'Content-Range': `bytes ${start}-${end}/${file.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end - start) + 1,
      'Content-Type': `video/${file.type}`
    }
    responseCode = 206
    streamOpts = {start, end}
  } else {
    head = {
      'Content-Length': file.length,
      'Content-Type': `video/${file.type}`
    }
    responseCode = 200
  }
  res.writeHead(responseCode, head)
  const stream = file.createReadStream(streamOpts)
  // stream.pipe(res)
  if (file.type !== 'mkv' ) stream.pipe(res)
  else {
    // const transcoded = ffmpeg(stream)
    //       .format('ogg')
    //       .videoCodec('libtheora')
    //       .audioCodec('libvorbis')
    //       .on('end', () => {
    //         console.log('file has been converted succesfully')
    //       })
    //       .on('error', (err, stdout, stderr) => {
    //         console.log('an error happened: ' + err.message, stdout, stderr)
    //       })
    //       .pipe(res, { end: true })
    // transcoded.type = 'ogg'
    const transcoded = ffmpeg(stream)
          .format('mp4')
          .videoCodec('libx264')
          .audioCodec('libmp3lame')
          .outputOptions('-movflags faststart')
          .on('progress', (progress) => {
            console.log('Processing: ' + progress)
          })
          .on('end', () => {
            console.log('file has been converted succesfully')
          })
          .on('error', (err, stdout, stderr) => {
            console.log('an error happened: ' + err.message, stdout, stderr)
          })
          .pipe(res, { end: true })
    transcoded.type = 'mp4'
  }
}
