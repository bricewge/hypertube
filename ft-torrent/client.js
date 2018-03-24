const peer = require('./peer')
const Torrent = require('./torrent')

const discover = require('./discoverPeers')()
const config = require('./config')

let torrent = new Torrent(config.infoHash)
torrent.peerId = config.selfId

function main () {
  discover.on('peer', (addressPort, source) => {
    torrent.addPeer(addressPort)
  })
  torrent.on('metadata', () => console.log('We got metadata for this torrent'))
  // discover.on('dhtAnnounce', connectToPeers)
}

main()
