var fs = require("fs");
var PEG = require("pegjs");
var htmlGrammar = fs.readFileSync(__dirname + "/htmlGrammar.pegjs", 'utf8');
// fs.writeFileSync(__dirname + "/htmlParser.js", PEG.buildParser(htmlGrammar));
module.exports = PEG.buildParser(htmlGrammar);