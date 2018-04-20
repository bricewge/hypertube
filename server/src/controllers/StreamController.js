const fs = require('fs')
const url = require('url')
const path = require('path')
const debug = require('debug')('stream')
const config = require('../config/config')

const CONTENT_TYPE = {
  MANIFEST: 'application/vnd.apple.mpegurl',
  SEGMENT: 'video/MP2T'
}

module.exports = {
  async show (req, res) {
    try {
      const filename = path.join(config.storage, req.params.MovieImdbId)
      // console.log(filename, )
      fs.accessSync(filename, fs.constants.R_OK)
      const filetype = path.extname(filename).toLowerCase().substr(1)
      // if (filetype === 'm3u8' || filetype === 'ts') {
      switch (filetype) {
      case 'm3u8':
        res.writeHead(200,{ 'Content-Type': 'application/vnd.apple.mpegurl'} )
        break
      case 'ts':
        res.writeHead(200, { 'Content-Type': 'video/MP2T' } )
        break
      default:
        debug('Invalid file format: %d', filename)
        res.status(404).send()
        return
      }
      const stream = fs.createReadStream(filename)
      stream.pipe(res)
      // res.status(400).send()
    } catch (err) {
      if (err.code === 'ENOENT') res.status(404).send()
      console.log(err)
      res.status(500).send()
    }
  }
}
