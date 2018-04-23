const {sequelize, Torrent} = require('../models')
var lol = require('path')
const Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var path = (process.env.STORAGE || ('/goinfre/' + process.env.USER))

sequelize.sync()
  .then(async () => {
    let items = fs.readdirSync(path)
    if (items !== undefined) {
      await test(items)
    }
    process.exit(0)
  })

async function test (items) {
  for (var i = 0; i < items.length; i++) {
    let filepath = path + '/' + items[i]
    if (lol.extname(filepath) === '.m3u8') {
      let stats = fs.statSync(filepath)
      let since = parseInt(Math.floor(Date.now() - stats.atimeMs) / 1000)
      if (since >= 60 * 60 * 24 * 30) {
        const parsed = lol.parse(filepath)
        const start = parsed.name
        deletefiles(start, items)
        deleteFolderRecursive(path + '/torrent-stream/' + start)
        fs.unlinkSync((path + '/torrent-stream/' + start + '.torrent'))
        Torrent.update({file_path: null}, {where: {file_path: filepath}})
      }
    }
  }
}

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

function deletefiles (start, items) {
//  console.log(items)
  let files = items.filter(filename => filename.substr(0, start.length) === start)
  for (let key in files) {
    fs.unlinkAsync(path + '/' + files[key])
  }
}
