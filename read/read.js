const fs = require('fs')
const path  = require('path')

function read (filename) {
  let users = fs.readFileSync(path.resolve('databease', filename + '.json'), 'utf-8')
  return  JSON.parse(users)
}

function wirete (filename, data){
  fs.writeFileSync(path.resolve('databease', filename + '.json'), JSON.stringify(data, null, 4))
  return  true
}




module.exports = {read,wirete,
}