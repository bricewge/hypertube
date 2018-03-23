const crypto = require('crypto')

exports.parsePeer = function (peer) {
  let res = peer.split(':')
  return {
    address: res[0],
    port: parseInt(res[1])
  }
}

exports.sha1sync = function (buf) {
  return crypto.createHash('sha1')
    .update(buf)
    .digest('hex')
}
