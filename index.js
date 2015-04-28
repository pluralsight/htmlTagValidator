var htmlParser = require('./src/html-parser');

function htmlTagValidator(source, callback) {
  setTimeout(function () {
	  try {
	  	var ast = htmlParser.parse(source);
	    callback(null, ast);
	  } catch (e) { 
	    callback(e);
	  }
  }, 0);
};

module.exports = htmlTagValidator;