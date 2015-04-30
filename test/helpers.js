var expect            = require('chai').expect,
    fs                = require('fs'),
    _                 = require('lodash'),
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
@param [Object] that
  The context of the running test
@param [Function] callback
  The function to call when htmlTagValidator has generated the AST or an error.
*/
getTree = function (that, callback) {
  var fileTitle = that.test.title.replace(/(?:\s+)([a-z0-9])/ig, function (matches, $1) {
    return $1.toUpperCase();
  });
  fs.readFile(__dirname + '/html/' + fileTitle + '.html', "utf8", function(err, data) {
    if (err) {
      callback(err);
    } else {
      htmlTagValidator(data, callback);
    };
  });
};

/**
Assert that the current file returns an AST without errors.
@param [Object] that
  The context of the running test
@param [Function] done
  The function to call when the test is completed
*/
assertOkTree = function (that, done) {
  getTree.call(that, that, function (err, ast) {
    broadcast(arguments);
    expect(err).to.be.null;
    expect(ast).to.be.ok;
    done.call(that);
  });
};

/**
Assert that the current file returns an error containing the properties and values in the
given object.
@param [Object|String] obj
  The properties and values to assert within the error generated for the running test. If
  a string is given, then it is asserted that the error message contains the text provided.
@param [Object] that
  The context of the running test
@param [Function] done
  The function to call when the test is completed
*/
assertErrorTree = function (obj, that, done) {
  getTree.call(that, that, function (err, ast) {
    broadcast(arguments);
    expect(ast).to.be.undefined;
    if (_.isString(obj)) { obj = { 'message': obj }; }
    _.forEach(obj, function (v, k) {
      expect(err).to.include.keys(k);
      expect(err[k]).to.contain(v);
    });
    done.call(that);
  });
};

module.exports = {
  'get': getTree,
  'ok': assertOkTree,
  'error': assertErrorTree
};
