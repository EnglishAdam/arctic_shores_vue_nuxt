const fs = require('fs')

/**
 * This logs an object as a JSON string against an id
 * @param {string} id File name identifier
 * @param {*} object
 */
function log(id, object) {
  // Set log folder path
  const logFolderPathName = './logs'

  // Create the folder if it doesn't exists
  if (!fs.existsSync(logFolderPathName)) {
    fs.mkdirSync(logFolderPathName)
  }

  // Create/Overwrite the file with the supplied object
  fs.createWriteStream(logFolderPathName + '/' + id + '.json', {
    flags: 'w'
  }).write(JSON.stringify(object))
}

module.exports = log
