const path = require('path')

module.exports = {
  port: process.env.PORT || 8081,
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  },
  torrent: {
    path: process.env.TORRENT_PATH || path.join('/goinfre/', process.env.USER)
  },
  formats: {
    native: ['webm', 'mp4'],
    transcode: ['mkv', 'avi']
  }
}
