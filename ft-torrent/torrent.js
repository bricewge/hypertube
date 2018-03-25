const EventEmitter = require('events').EventEmitter
const net = require('net')
const path = require('path')
const mkdirp = require('mkdirp')
const parseTorrent = require('parse-torrent')
const Piece = require('torrent-piece')
const extendMutable = require('xtend/mutable')
// const Bitfield = require('bitfield')
const FSChunkStore = require('fs-chunk-store')
const debug = require('debug')('ft-torrent:torrent')
const Peer = require('./peer')

class Torrent extends EventEmitter {
  constructor (infoHash) {
    super()
    this.infoHash = infoHash.toLowerCase()

    this.pieces = []
    this._hashes = [] // Hash of thes pieces
    this.peers = {} // All peers
    this.wires = new Set() // Added after handhsakes
    this.peerId = null
    // this.trackers = []
    this.metadata = null
    // this.bitfield = null // send after the handshake to indicate already succecfully downloaded pieces

    // this.uploaded = 0 // bytes uploaded to peers
    // this.downloaded = 0 // bytes downloaded from peers
    this.progress = false // torrent download progress, from 0 to 1
    this.destroyed = false

    this.files = [] // files to download from the torrent

    this.path = path.join('/tmp/ft-torrent', this.infoHash)
    mkdirp(this.path, (err) => this.destroy(err))
  }

  get metadata () {
    return this._metadata
  }

  // Only accept raw metadata
  set metadata (rawMetadata) {
    if (!rawMetadata) return
    try {
      let parsedTorrent = parseTorrent(rawMetadata)
      if (this.infoHash !== parsedTorrent.infoHash) return
      this._metadata = parsedTorrent
    } catch (err) {
      this._metadata = null
      return
    }
    debug('metadata added: %O', this.metadata)

    extendMutable(this, this._metadata)
    this._hashes = this.pieces

    this.pieces = this.pieces.map(function (hash, i) {
      let pieceLength = (i === this.pieces.length - 1)
        ? this.lastPieceLength
        : this.pieceLength
      return new Piece(pieceLength)
    })

    // this.bitfield = new Bitfield(this.pieces.length)

    for (let i in this.peers) {
      let peer = this.peers[i]
      if (peer.destroyed) continue
      if (peer.metadataRequested) {
        peer.metadataRequested = false
        peer.wire.ut_metadata.cancel()
        peer.wire.ut_metadata.setMetadata(rawMetadata)
      }
      // this._wireOnMetadata(peer.wire)
    }
    // this.pieces = new Piece()
    this.emit('metadata', this.metadata)
    // this._test()
    this._initStore()
  }

  _wireOnMetadata (wire) {
    wire.on('have', (i) => this._request(wire, i))
  }

  _request (wire, index) {
    wire.request(index,
                 0,
                 this.metadata['piece length'],
                 (err, block) => {
                   if (err) console.log('ERROR:', err.message)
                   else console.log(block)
                 })
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

  // TODO Manage torrent with multiple files
  _initStore () {
    if (this.metadata.files) return
    let chunks = new FSChunkStore(this.metadata['piece length'], {
      path: path.join(this.path, this.metadata.name),
      length: this.metadata.length
    })
    console.log(chunks)
  }

  _test () {
    for (let i in this.peers) {
      let peer = this.peers[i]
      if (peer.destroyed) continue
      if (!peer.wire.peerPieces.get(0)) continue
      peer.wire.amChoking = false
      console.log(peer.id)
      if (peer.wire.peerChocking) continue
      peer.wire.request(0,
                        0,
                        this.metadata['piece length'],
                        (err, block) => {
                          if (err) console.log('ERROR:', err.message)
                          else console.log(block)
                        })
      console.log(peer.requests)
    }
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
