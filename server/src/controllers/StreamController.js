const fs = require('fs')
const path = require('path')
const debug = require('debug')('stream')
const config = require('../config/config')

module.exports = {
  async show (req, res) {
    try {
      const filename = path.join(config.storage, req.params.movieId)
      fs.accessSync(filename, fs.constants.R_OK)
      const filetype = path.extname(filename).toLowerCase().substr(1)
      switch (filetype) {
        case 'm3u8':
          res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl' })
          break
        case 'ts':
          res.writeHead(200, { 'Content-Type': 'video/MP2T' })
          break
        default:
          debug('Invalid file format: %d', filename)
          res.status(404).send()
          return
      }
      const stream = fs.createReadStream(filename)
      stream.pipe(res)
    } catch (err) {
      if (err.code === 'ENOENT') res.status(404).send()
      //  console.log(err)
      res.status(499).send()
    }
  }
}
