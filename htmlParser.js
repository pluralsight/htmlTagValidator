var fs = require("fs");
var PEG = require("pegjs");
var htmlGrammar = fs.readFileSync(__dirname + "/htmlGrammar.pegjs", 'utf8')
console.log(PEG.buildParser(htmlGrammar).parse.toString())
module.exports = PEG.buildParser(htmlGrammar);