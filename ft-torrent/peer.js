// const net = require('net')
const Wire = require('bittorrent-protocol')
const utMetadata = require('ut_metadata')
const utils = require('./utils')

// We activly try to connect to a peer
exports.createOutgoingPeer = function (addressPort, torrent) {
  let peer = new Peer(addressPort, 'out')

  peer.torrent = torrent
  return peer
}

// A peer tried to connect to us
exports.createIncomingPeer = function (conn) {
  let addressPort = conn.remoteAddress + ':' + conn.remotePort
  let peer = new Peer(addressPort, 'in')

  peer.conn = conn
  return peer
}

class Peer {
  constructor (id, type) {
    this.id = id // ip:port
    this.type = type

    let tmp = utils.parsePeer(id)
    this.address = tmp.address
    this.port = tmp.port
    this.conn = null
    this.wire = null
    this.torrent = null
    this.connected = false
    this.destroyed = false
    // this.timeout = null
    this.retries = 0 // outgoing TCP connection retry count
    this.sentHandshake = false
  }

  connect (conn) {
    if (this.destroyed) return
    this.connected = true
    if (!this.conn) this.conn = conn
    this.conn.once('close', () => this.destroy())
    this.conn.once('end', () => this.destroy())
    this.conn.once('error', (err) => this.destroy(err))
    this.wire = new Wire()
    this.wire.once('error', (err) => this.destroy(err)) // Not sure if needed since it's pipe with 'conn'

    this.wire.once('handshake', (infoHash, peerId) => this.onHandshake)
    // TODO Signal that we have metadata we received it
    // this.wire.use(utMetadata(this.torrent.metadata))
    this.wire.use(utMetadata())

    this.conn.pipe(this.wire).pipe(this.conn)
  }

  handshake () {
    const opts = { dht: true }
    this.wire.handshake(this.torrent.infoHash, this.torrent.peerId, opts)
    this.sentHandshake = true
  }

  onHandshake (infoHash, peerId) {
    if (this.destroyed) return
    // if (!this.torrent) // TODO Set it! It should only happen when incoming
    // add the peer to the corrent torrent
    // if (peerId === this.torrent.peerId) {
    //   this.destroy(new Error('don\'t connect to yourself'))
    //   return
    // }

    this.tries = 0

    if (!this.handsake) this.handsake()
    // if (!this.torrent.metadata) // TODO Conditionaly fetch metadata
    this.wire.ut_metadata.fetch()
  }

  destory (err) {
    if (this.destroyed) return
    this.destroyed = true
    console.error(err)

    if (this.conn) this.conn.destroy()
    this.conn = null
    if (this.wire) this.wire.destory()
    this.wire = null
  }
}
