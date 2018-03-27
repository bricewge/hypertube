const torrentStream = require('torrent-stream')
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
// const http = require('http')

// const hash = '3F8F219568B8B229581DDDD7BC5A5E889E906A9B'
const hash = '88594AAACBDE40EF3E2510C47374EC0AA396C08E'
// const hash = '10EA57E365DB30BDEE0EE24C97D720DC8E0AAD5B' // MKV

// Stop the process with Ctrl+c
// process.once('SIGINT', function () {
//   process.kill(process.pid, 'SIGINT')
// })

// let server = http.createServer()
let engine = torrentStream(hash)
let app = express()

app.listen(3000, () => console.log('Example app listening on port 3000!'))

engine.on('ready', function () {
  console.log('ready')
  engine.files.forEach(function (file) {
    console.log(file.name)
    if (file.name.indexOf('.mp4') !== -1) {
      // var stream = file.createReadStream()
      // console.log(stream)
      app.get('/stream/:hash', function (req, res) {
        console.log('request')
        const range = req.headers.range

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-')
          // const start = parseInt(parts[0], 10)
          // const end = parts[1]
          //       ? parseInt(parts[1], 10)
          //       : file.length - 1
          const start = parseInt(parts[0])
          const end = parseInt(file.length) - 1
          const chunksize = (end - start) + 1
          const stream = file.createReadStream({start, end})
          const head = {
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
          }
          console.log(head)
          res.writeHead(206, head)
          // res.send()
          stream.pipe(res)
        } else {
          const head = {
            'Content-Length': file.length,
            'Content-Type': 'video/mp4'
          }
          res.writeHead(200, head)
          // res.send()
          const stream = file.createReadStream()
          stream.pipe(res)
        }
        // const range = req.headers.range
        // const head = {
        //   'Content-Length': file.length,
        //   'Content-Type': 'video/mp4'
        // }

        // if (range) {
        //   res.writeHead(206, head)
        //   stream.pipe(res)
        // } else {
        //   res.writeHead(200, head)
        //   stream.pipe(res)
        //   // res.send()
        //   // res.pipe(stream)
        // }
      })
    }
    // console.log(stream)
    // stream is readable stream to containing the file content
  })
})
