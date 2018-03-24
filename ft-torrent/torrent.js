const EventEmitter = require('events').EventEmitter
const net = require('net')
const mkdirp = require('mkdirp')
const bencode = require('bencode')
const debug = require('debug')('ft-torrent:torrent')
const Peer = require('./peer')
const utils = require('./utils')

class Torrent extends EventEmitter {
  constructor (infoHash) {
    super()
    this.infoHash = infoHash.toLowerCase()

    this.pieces = null
    this.peers = {}
    this.peerId = null
    this.trackers = []
    this.metadata = null
    this.uploaded = 0 // bytes uploaded to peers
    this.downloaded = 0 // bytes downloaded from peers
    this.progress = false // torrent download progress, from 0 to 1
    this.destroyed = false
    this.files = [] // files to download from the torrent

    this.path = `/tmp/ft-torrent/${this.infoHash}`
    mkdirp(this.path, (err) => this.destroy(err))
  }

  get metadata () {
    return this._metadata
  }

  // Only accept raw metadata
  set metadata (rawMetadata) {
    if (!rawMetadata) return
    let metadata = bencode.decode(rawMetadata).info
    const computedHash = utils.sha1sync(bencode.encode(metadata))
    if (this.infoHash !== computedHash) return
    this._metadata = bencode.decode(rawMetadata, 'utf8').info
    debug('metadata added: %O', this.metadata)
    for (let i in this.peers) {
      let peer = this.peers[i]
      if (!peer.destroyed || !peer.metadataRequested) continue
      peer.metadataRequested = false
      peer.wire.ut_metadata.cancel()
      peer.wire.ut_metadata.setMetadata(rawMetadata)
    }
    this.emit('metadata', this.metadata)
  }

  // TODO Limit number of connections
  // TODO Manage incoming connections
  addPeer (peer) {
    let newPeer
    if (typeof peer === 'string' || peer instanceof String) {
      newPeer = Peer.createOutgoingPeer(peer, this)
      newPeer.conn = new net.Socket()
    } // else {
    //   newPeer = Peer.createIngoingPeer(peer)
    // }
    if (this.peers[newPeer.id]) return
    newPeer.connect()
    this.peers[newPeer.id] = newPeer
    debug('peers: %s', Object.keys(this.peers).length)
  }

  // TODO Write destroy
  destroy (err) {
    if (err) debug('destroy %o: %O', this.infoHash, err)
    for (let i in this.peers) {
      this.peers[i].destroy()
    }
    // delete this // NOTE ? Is it right ?
  }
}

module.exports = Torrent
