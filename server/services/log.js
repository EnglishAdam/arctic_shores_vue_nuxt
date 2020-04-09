const fs = require('fs')

function log(id, object) {
  const logFolderPathName = './logs'

  if (!fs.existsSync(logFolderPathName)) {
    fs.mkdirSync(logFolderPathName)
  }

  fs.createWriteStream(logFolderPathName + '/' + id + '.json', {
    flags: 'w'
  }).write(JSON.stringify(object))
}

module.exports = log
