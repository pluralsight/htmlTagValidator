var expect = require('chai').expect,
    fs = require('fs'),
    htmlTagValidator = require('../index');

describe('html-tag-validator', function() {
  var testFile = function (sourcePath, testFunc) {
      fs.readFile(__dirname + '/html/' + sourcePath, "utf8", function(err, data) {
        if (err) {
          testFunc(err);
        } else {
          htmlTagValidator(data, testFunc);
        };
      });
  };

  describe('with a well-formed document', function() { 
    it('is generating something', function(done) { 
      testFile('basicDiv.html', function (err, ast) {
        console.log('err: ', err);
        expect(err).to.be.null;
        console.log('generated: ', ast);
        expect(ast).to.be.ok; 
        done();
      });
    });
  });
  // describe('with a single html element with missing closing tag', function() {
  //   it('raises an error', function() {
  //     console.log(validateHtml('/testHtml/basicDiv.html'))
  //     expect(function(){ validateHtml('/testHtml/basicDiv.html')}).to.throw('Expected open tag: div to match closing tag: p')
  //   });
  // });
});