const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const path = require('path')
const fs = require('fs')
// const {PassThrough} = require('stream')
const touch = require('touch')

const app = express()
// const hash = '3F8F219568B8B229581DDDD7BC5A5E889E906A9B'
// const hash = '88594AAACBDE40EF3E2510C47374EC0AA396C08E'
// const hash = '10EA57E365DB30BDEE0EE24C97D720DC8E0AAD5B' // MKV
// ce9156eb497762f8b7577b71c0647a4b0c3423e1 // MKV
const magnet = 'magnet:?xt=urn:btih:8ED0B5F193B18522E9067141638226469D9AB6C3&dn=%5Bzooqle.com%5D%20Star%20Wars%3A%20The%20Last%20Jedi%20%282017%29%20%5BBluRay%5D%20%5B720p%5D%20%5BYTS.AM%5D&tr=udp://tracker.coppersurfer.tk:6969&tr=http://tracker.mg64.net:6881/announce&tr=http://mgtracker.org:2710/announce&tr=http://announce.xxx-tracker.com:2710/announce&tr=http://open.acgtracker.com:1096/announce&xl=1362827241&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=http%3A%2F%2Fmgtracker.org%3A2710%2Fannounce'
const nativeFormats = ['webm', 'mp4']
const transcodeFormats = ['mkv', 'avi']

let torrentsDownloading = {}

app.listen(3000, () => console.log('Hypertube is listening on port 3000!'))

// TODO Delete torrent at startup based on ctime

// TODO Move this to app.js
const torrentsPath = path.join('/goinfre/', process.env.USER)

// TODO Handle errors correctly
// Get a stream from the cache, a file or download it
exports.get = function (req, res, next) {
  try {
    const infoHash = req.params.hash.toLowerCase()
    // const infoHash = magnet
    // console.log(infoHash)
    if (torrentsDownloading[infoHash]) {
      console.log('Here you go, it\'s already downloading')
      res.file = torrentsDownloading[infoHash]
      // console.log(res.file.engine.selection)
      next()
    } else if (false) { // TODO Test if torrent is the db
      // fs.s
      next()
    } else {
      console.log('We will initiate a download in a short while')
      const engine = torrentStream(infoHash,
                                   {path: path.join(torrentsPath, infoHash)})
      engine.once('ready', () => onEngineReady(engine, res, next))
      engine.once('idle', () => onEngineIdle(infoHash))
    }
  } catch (err) { next(err) }
}

exports.send = async function (req, res, next) {
  const range = req.headers.range
  let head
  let start = 0
  let end = res.file.length - 1

  // if (range) {
  //   const parts = range.replace(/bytes=/, '').split('-')
  //   start = parseInt(parts[0], 10)
  //   end = parts[1] ? parseInt(parts[1], 10) : end
  //   head = {
  //     'Content-Range': `bytes ${start}-${end}/${res.file.length}`,
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': (end - start) + 1,
  //     'Content-Type': `video/${res.file.type}`
  //   }
  //   res.writeHead(206, head)
  //   req.range.start = start
  //   req.range.end = end
  // } else {
  //   head = {
  //     'Content-Length': res.file.length,
  //     'Content-Type': `video/${res.file.type}`
  //   }
  //   res.writeHead(200, head)
  // }

  head = {
    // 'Content-Length': res.file.length,
    'Content-Type': `video/${res.file.type}`
  }
  res.head = head

  // transcode(stream, res)// .pipe(res, { end: true })
  // stream.pipe(res)
  if (res.file.transcoded) {
    if (!res.file.transcodePath) {
      const stream = res.file.createReadStream()
      res.file.transcodePath = path.join(res.file.engine.path,
                                         res.file.path.name + '.mp4')
      await touch(res.file.transcodePath)
      // head['Content-Length'] = 0
      // res.writeHead(200, head)
      transcode(stream, res.file.transcodePath, res)
        .on('progress', function respond (progress) {
          if (progress.frames < 24 * 10) return
          // res.head['Content-Length'] = fs.statSync(res.file.transcodePath).size
          res.writeHead(200, res.head)
          fs.createReadStream(res.file.transcodePath).pipe(res)
          this.removeListener('progress', respond)
          console.log('Response sent')
        })
    } else {
      // head['Content-Length'] = fs.statSync(res.file.transcodePath).size
      res.writeHead(200, head)
      fs.createReadStream(res.file.transcodePath).pipe(res)
    }
    // console.log(typeof res.file.transcodePath)
    // console.log(result)
    // }
  } else {
    res.writeHead(200, head)
    const stream = res.file.createReadStream({start, end})
    stream.pipe(res)
  }
}



// TODO use correnct param, NOT req.params.hash
app.get('/stream/:hash',
        exports.get,
        exports.send)



function onEngineReady (engine, res, next) {
  for (let i in engine.files) {
    let file = engine.files[i]
    file.path = path.parse(file.name)
    file.type = file.path.ext.toLowerCase().substr(1)
    if (nativeFormats.includes(file.type)) file.transcoded = false
    else if (transcodeFormats.includes(file.type)) {
      file.transcoded = true
      file.type = 'mp4'
    } else continue
    // We don't want to stream a trailer instead of the movie
    if (!res.file || file.length > res.file.length) res.file = file
  }
  res.file.engine = engine
  torrentsDownloading[engine.infoHash] = res.file
  res.file.select()
  console.log(res.file.name, res.file.type)
  next()
}

function onEngineIdle (infoHash) {
  const file = torrentsDownloading[infoHash]
  delete torrentsDownloading[infoHash]
  console.log(`Torrent ${infoHash} finished downloading`)
  if (file.transcoded) {
    console.log('TODO It should be added to the db since it is a native format')
  }
  // Keep seeding the torrent to keep the swarm healthy
  const day = 24 * 60 * 60 * 1000
  setTimeout(() => {
    file.engine.destroy()
  },
  15 * day) // NOTE Over 23 days it overflow
}

function transcode (streamIn, file, res) {
  try {
    return ffmpeg(streamIn)
      .format('mp4')
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .outputOption('-movflags frag_keyframe+faststart')
      .save(file)
      .on('progress', (progress) => { console.log(`Frame ${progress.frames}`) })
      .on('end', () => {
        console.log('file has been converted succesfully')
      })
      .on('error', (err, stdout, stderr) => {
        console.log('an error happened: ' + err.message, stdout, stderr)
      })
  } catch (err) { console.log(err) }
}
