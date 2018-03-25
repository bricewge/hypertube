const crypto = require('crypto')

// TODO Remove unused functions

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

exports.remove = function (array, element) {
  const index = array.indexOf(element)
  if (index !== -1) array.splice(index, 1)
}
