exports.parsePeer = function (peer) {
  let res = peer.split(':')
  return {
    address: res[0],
    port: parseInt(res[1])
  }
}
