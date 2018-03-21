const Protocol = require('bittorrent-protocol')
const net = require('net')
const ut_metadata = require('ut_metadata')
const bencode = require('bencode')
const discover = require('./discoverPeers')()
const utils = require('./utils')
const config = require('./config')

var peers = []

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
  for (let i = 0; i < 5; i++) {
    let peer = peers[13 + i]
    console.log(peer)
    const socket = new net.Socket()
    socket.connect(peer.port, peer.address, () => {
      const wire = new Protocol()
      socket.pipe(wire).pipe(socket)
      wire.handshake(config.infoHash, config.selfId, { dht: true })
      wire.on('handshake', (ih, ip, ext) => {
        console.log('received handshake:', ih, ip, ext)
        // socket.destroy()
      })
    })
    socket.on('error', (err) => {
      console.log(err)
      !socket.destroyed && socket.destroy()
    })
  }
}

module.exports = fetchMetadata
