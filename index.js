var htmlParser = require('./src/html-parser'),
    toStr = function (f) {
      return Object.prototype.toString.call(f);
    };

function htmlTagValidator(source, callback) {
  var options = htmlTagValidator._options, func = callback;
  if (arguments.length > 2) {
    options = callback;
    func = arguments[2];
  }

  if (toStr(func) !== '[object Function]') {
    // Sync
    if (toStr(func) === '[object Object]') {
      options = func;
    }
    return htmlParser(source, options);
  }

  // Async
  setTimeout((function (ctx, s, o, f) {
    return function () {
      var ast, err;
      try {
        ast = htmlParser.parse(s, o);
      } catch (e) {
        err = e;
      }
      f.apply(ctx, [err, ast]);
    };
  })(this, source, options, func), 0);
};

htmlTagValidator._name = "html-tag-validator";
htmlTagValidator.VERSION = "1.0.8";
htmlTagValidator._options = {};

htmlTagValidator.setOptions = function(options) {
  this._options = options != null ? options : {};
};

module.exports = htmlTagValidator;
