const judgesRegex = require('./judges')
const fs = require('fs')
const glob = require('glob')

glob("tests/regex_*", function (er, files) {

	files.forEach((file)=>{
		fs.unlinkSync(file)
	})

	console.log(files)
	var judgesList = JSON.parse(fs.readFileSync('data/alljudges.json').toString())

	judgesList = judgesList.map(judgesRegex.normalizeNameField)
	judgesListNotMatched = []

	judgesRegex.debug = true

	judgesList.forEach((judge)=>{
		var r = judgesRegex.extractJudgeNames(judge)
		if (!r) judgesListNotMatched.push(judge)
	})

	judgesList.sort()
	fs.writeFileSync('data/alljudges_out.json',JSON.stringify(judgesList,null,2))

	judgesListNotMatched.sort()
	fs.writeFileSync('data/alljudges_not_matched.json',JSON.stringify(judgesListNotMatched,null,2))
})