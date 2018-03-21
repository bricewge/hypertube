const crypto = require('crypto')

const examples = {
  hashPF: '3F8F219568B8B229581DDDD7BC5A5E889E906A9B', // Pulp Fiction
  hashBBB: '88594AAACBDE40EF3E2510C47374EC0AA396C08E' // Big Buck Bunny
}

module.exports = {
  port: 1337,
  selfId: crypto.randomBytes(20).toString('hex'),
  infoHash: examples.hashBBB.toLowerCase()
}
