const judgesRegex = require('./judges')
const fs = require('fs')

var judgesList = JSON.parse(fs.readFileSync('data/alljudges.json').toString())

judgesList = judgesList.map(judgesRegex.normalizeNameField)

judgesList.sort()
fs.writeFileSync('data/alljudges_out.json',JSON.stringify(judgesList,null,2))
