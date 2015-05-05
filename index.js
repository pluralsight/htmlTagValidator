var htmlParser = require('./src/html-parser');

function htmlTagValidator(source, callback) {
  var options = htmlTagValidator._options, func = callback;
  if (arguments.length > 2) {
    options = callback;
    func = arguments[2];
  }
  if (Object.prototype.toString.call(func) !== '[object Function]') {
    throw new TypeError(
      'The last argument provided to the parser function should be a callback function',
      htmlTagValidator._name
    );
  }
  setTimeout(function () {
	  try {
	  	var ast = htmlParser.parse(source, options);
      func(null, ast);
	  } catch (e) {
      func(e);
	  }
  }, 0);
};

htmlTagValidator._name = "html-tag-validator";
htmlTagValidator._options = {};

htmlTagValidator.setOptions = function(options) {
  this._options = options != null ? options : {};
};

module.exports = htmlTagValidator;
