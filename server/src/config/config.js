const path = require('path')

module.exports = {
  port: process.env.PORT || 8081,
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  },
  storage: process.env.STORAGE || path.join('/goinfre/', process.env.USER),
  formats: {
    native: ['webm', 'mp4'],
    transcode: ['mkv', 'avi']
  },
  upload: {
    dest: 'public/uploads/',
    limits: {fileSize: 5000000, files: 1}
  }
}
