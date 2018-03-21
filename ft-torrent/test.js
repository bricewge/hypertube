const torrentStream = require('torrent-stream')
const express = require('express')
// const http = require('http')

// const hash = '3F8F219568B8B229581DDDD7BC5A5E889E906A9B'
const hash = '88594AAACBDE40EF3E2510C47374EC0AA396C08E'

// Stop the process with Ctrl+c
// process.once('SIGINT', function () {
//   process.kill(process.pid, 'SIGINT')
// })

// let server = http.createServer()
let engine = torrentStream(hash)
let app = express()

app.listen(3000, () => console.log('Example app listening on port 3000!'))

engine.on('ready', function () {
  engine.files.forEach(function (file) {
    console.log(file.name)
    if (file.name.indexOf('.mp4') !== -1) {
      var stream = file.createReadStream()
      console.log(stream)
      app.get('/', function (req, res) {
        stream.pipe(res)
        // res.send()
        // res.pipe(stream)
      })
    }
    // console.log(stream)
    // stream is readable stream to containing the file content
  })
})
