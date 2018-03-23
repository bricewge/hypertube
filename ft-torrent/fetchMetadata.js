const Protocol = require('bittorrent-protocol')
const net = require('net')
const ut_metadata = require('ut_metadata')
const bencode = require('bencode')
const discover = require('./discoverPeers')()
const utils = require('./utils')
const config = require('./config')

var peers = []
var metadata = null
function fetchMetadata () {
  discover.on('peer', (peer, source) => {
    console.log('Peer (discovery):', peer, source)
    peers.push(utils.parsePeer(peer))
  })
  discover.on('dhtAnnounce', connectToPeers)
}

function connectToPeers () {
  // let i = 0
  // let peer = peers[i]
  // if (peer.port === config.port) peer = peers[++i]
  // console.log(peer)
  for (let i in peers) {
    let peer = peers[i]
    console.log(peer)
    const socket = new net.Socket()
    const wire = new Protocol()
    socket.pipe(wire).pipe(socket)
    socket.connect(peer.port, peer.address, () => {
      // const wire = new Protocol()
      wire.use(ut_metadata(metadata))
      // socket.pipe(wire).pipe(socket)
      wire.handshake(config.infoHash, config.selfId, { dht: true })
      wire.on('handshake', (ih, ip, ext) => {
        wire.ut_metadata.fetch()
        console.log('received handshake:', ih, ip, ext)
        // console.log(wire)
      })
      return wire.ut_metadata.on('metadata', function (rawMetadata) {
        // try {
        let info = bencode.decode(rawMetadata).info
        let metadata = bencode.encode(info)
        let computedHash = utils.sha1sync(metadata)
        if (config.infoHash !== computedHash) {
          console.log('FALSE!!!')
        }
        console.log(computedHash, config.infoHash)
        console.log(info)
        // process.exit()
        // } catch (err) { metadata = null }
        // return metadata
      })
    })
    socket.on('error', (err) => {
      console.log(err.errno)
      !socket.destroyed && socket.destroy()
    })
  }
}

module.exports = fetchMetadata
