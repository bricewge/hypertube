// TODO Use patched torrent-discovery
const Discovery = require('torrent-discovery')
const config = require('./config')

// TODO Reuse DHT instance between torrents
// TODO Use nicer API
module.exports = function () {
  let discovery = new Discovery({
    infoHash: config.infoHash,
    peerId: config.selfId,
    port: config.port,
    tracker: false
  })
  // process.once('SIGINT', function () {
  //   discovery.destroy()
  //   process.kill(process.pid, 'SIGINT')
  // })
  // discovery.on('dhtAnnounce', () => console.log('Announced'))
  // discovery.on('warning', (err) => console.log('Warning:', err))
  discovery.on('error', (err) => console.log('Error:', err))
  // discovery.on('peer', (peer, source) => console.log('Peer (discovery):', peer, source))

  return discovery
}
