const {Socket} = require('net')
const Wire = require('bittorrent-protocol')
const utMetadata = require('ut_metadata')
const debug = require('debug')('ft-torrent:peer')
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

// TODO Write retry logic
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
    this.metadataRequested = false // we asked for metadata
  }

  // Connect to a peer, used on outgoing connections
  connect () {
    debug('connect to %o', this.id)
    this.conn = new Socket()
    this.conn.connect(this.port, this.address, this.onConnect())
  }

  onConnect () {
    if (this.destroyed) return
    debug('onConnect %o', this.id)
    this.connected = true
    // if (!this.conn) return // TODO inform that we don't have a socket
    this.conn.once('close', () => this.destroy())
    this.conn.once('end', () => this.destroy())
    this.conn.once('error', (err) => this.destroy(err))

    this.wire = new Wire()
    this.wire.use(utMetadata(this.torrent.metadata))
    this.wire.once('error', (err) => this.destroy(err))
    this.wire.once('handshake', (hash, id) => this._onHandshake(hash, id))
    this.wire.ut_metadata.on('metadata', (raw) => this._onMetadata(raw))

    this.conn.pipe(this.wire).pipe(this.conn)
    if (!this.sentHandshake) this.handshake()
  }

  handshake () {
    debug('handshake to %o', this.id)
    const opts = { dht: true }
    this.wire.handshake(this.torrent.infoHash, this.torrent.peerId, opts)
    this.sentHandshake = true
  }

  _onHandshake (infoHash, peerId) {
    if (this.destroyed) return
    debug('handshake from %o', this.id)
    // if (!this.torrent) // TODO Set it! It should only happen when incoming
    if (peerId === this.torrent.peerId) {
      this.destroy(new Error('don\'t connect to yourself'))
      return
    }
    this.tries = 0
    if (!this.torrent.metadata) {
      this.wire.ut_metadata.fetch()
      this.metadataRequested = true
    }
    if (!this.sentHandshake) this.handshake()
  }

  _onMetadata (rawMetadata) {
    debug('metadata from %o', this.id)
    if (this.torrent.metadata) return
    this.torrent.metadata = rawMetadata
  }

  destroy (err) {
    if (this.destroyed) return
    if (err) debug('destory %o: %s', this.id, err.code)
    this.destroyed = true
    // TODO ? reset all properties ?

    if (this.conn) this.conn.destroy()
    this.conn = null
    if (this.wire) this.wire.destroy()
    this.wire = null
  }
}
