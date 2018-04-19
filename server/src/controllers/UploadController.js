const crypto = require('crypto')
const path = require('path')
const multer = require('multer')
const config = require('../config/config').upload

const storage = multer.diskStorage({
  destination: config.dest,
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return callback(err)
      callback(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

function imageFilter (req, file, cb) {
  const filetypes = /jpeg|jpg|png/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  if (mimetype && extname) return cb(null, true)
  cb(null, false)
}

module.exports = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: config.limits
})
