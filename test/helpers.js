var expect            = require('chai').expect,
    fs                = require('fs'),
    _                 = require('lodash'),
    htmlTagValidator  = require('../index'),
    prettyjson        = require('prettyjson'),
    getTree, assertOkTree, assertErrorTree;

var broadcast = function (args) {
  _.forEach(args, function (arg) {
    console.log('\n');
    console.log(_.isObject(arg) ? prettyjson.render(arg, {}) : arg);
    console.log('\n');
  });
};

/**
Load the source file for the current test and then try and generate the AST from it.
@note Uses the name of the test to determine what test input to use such that `bees-test`
  looks for the file `beesTest.html` in the `./test/html/` directory.
@note Alternative arguments format to pass options object is: that, options, callback.
@param [Object] that
  The context of the running test
@param [Function] callback
  The function to call when htmlTagValidator has generated the AST or an error.
*/
getTree = function (that, callback) {
  var args = Array.prototype.slice.call(arguments, 1),
      fileTitle = that.test.title.replace(/(?:\s+)([a-z0-9])/ig, function (matches, $1) {
        return $1.toUpperCase();
      }),
      filePath = __dirname + '/html/' + fileTitle + '.html';
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      callback(err);
    } else {
      args.unshift(data);
      htmlTagValidator.apply(that, args);
    };
  });
};

/**
Assert that the current file returns an AST without errors.
@note Alternative arguments format to pass options object is: that, options, done.
@param [Object] that
  The context of the running test
@param [Function] done
  The function to call when the test is completed
*/
assertOkTree = function (that, done) {
  var options = {}, func = done;
  if (arguments.length > 2) {
    options = done;
    func = arguments[2];
  }
  getTree.apply(that, [that, options, function (err, ast) {
    broadcast(arguments);
    expect(err).to.be.null;
    expect(ast).to.be.ok;
    func.call(that);
  }]);
};

/**
Assert that the current file returns an error containing the properties and values in the
given object.
@note Alternative arguments format to pass options object is: obj, that, options, done.
@param [Object|String] obj
  The properties and values to assert within the error generated for the running test. If
  a string is given, then it is asserted that the error message contains the text provided.
@param [Object] that
  The context of the running test
@param [Function] done
  The function to call when the test is completed
*/
assertErrorTree = function (obj, that, done) {
  var options = {}, func = done;
  if (arguments.length > 3) {
    options = done;
    func = arguments[3];
  }
  getTree.apply(that, [that, options, function (err, ast) {
    expect(ast).to.be.undefined;
    if (_.isString(obj)) { obj = { 'message': obj }; }
    _.forEach(obj, function (v, k) {
      expect(err).to.include.keys(k);
      expect(err[k]).to.contain(v);
    });
    func.call(that);
  }]);
};

module.exports = {
  'get': getTree,
  'ok': assertOkTree,
  'error': assertErrorTree,
  'broadcast': broadcast
};
