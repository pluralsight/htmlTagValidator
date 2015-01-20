// Goal: Write a function that will reverse an array.
// Requirements: Make all of these tests pass without using the JavaScript reverse method.
// To run: mocha -w closingTagSpec.js

var expect = require('chai').expect,
    validate = require('./htmlTagValidator.js'),
    fs = require('fs'),
    options = {};

var validateHtml = function(path) {
  var html = fs.readFileSync(__dirname + path, 'utf8');
  return validate(html, options);
}

var validateHtmlReturnData = function(path) {
  try {
    validateHtml(path)
  } catch(e) {
    return e.lineData;
  }
}

describe('htmlTagValidator', function() {
  describe('with a single html element with missing closing tag', function() {
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/basicDiv.html')}).to.throw(Error)
    });
    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/basicDiv.html');

         expect(errorData).to.have.property('line', 1);
         expect(errorData).to.have.property('char', 4);
         expect(errorData).to.have.property('name', "div");
      });
    });
  });

  describe('with malformed class value', function(){
    it('raises an error', function(){
      expect(function(){validateHtml('/testHtml/malformedClassValue.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/malformedClassValue.html');

         expect(errorData).to.have.property('line', 1);
         expect(errorData).to.have.property('char', 11);
         expect(errorData).to.have.property('name', "div");
      });
    });
  });

  describe('with malformed id value', function(){
    it('raises an error', function(){
      expect(function(){validateHtml('/testHtml/malformedIValue.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
        var errorData = validateHtmlReturnData('/testHtml/malformedIdValue.html');

        expect(errorData).to.have.property('line', 1);
        expect(errorData).to.have.property('char', 8);
        expect(errorData).to.have.property('name', "div");
      });
    });
  });

  describe('with malformed attribute name', function(){
    it('raises an error', function(){
      expect(function(){validateHtml('/testHtml/malformedAttributeName.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
        var errorData = validateHtmlReturnData('/testHtml/malformedAttributeName.html');

        expect(errorData).to.have.property('line', 1);
        expect(errorData).to.have.property('char', 10);
        expect(errorData).to.have.property('name', "div");
      });
    });
  });

  describe('with a malformed html tag', function() {
    describe('at the beginning tag', function(){
      it('raises an error', function() {
        expect(function(){ validateHtml('/testHtml/basicDiv2.html')}).to.throw(Error)
      });

      it("contains line data", function() {
        var errorData = validateHtmlReturnData('/testHtml/basicDiv2.html');

        expect(errorData).to.have.property('line', 1);
        expect(errorData).to.have.property('char', 4);
        expect(errorData).to.have.property('name', "div");
      });
    })

    // The error thrown by this indicates a missing end tag, since the validator is unable
    // to match a starting tag with a malformed end tag. This is acceptable for now.
    describe('at the beginning of the end tag', function(){
      it('raises an error', function() {
        expect(function(){ validateHtml('/testHtml/basicDiv3.html')}).to.throw(Error)
      });

      it("contains line data", function() {
        var errorData = validateHtmlReturnData('/testHtml/basicDiv3.html');

        expect(errorData).to.have.property('line', 1);
        expect(errorData).to.have.property('char', 4);
        expect(errorData).to.have.property('name', "div");
      });
    });

    // The error thrown by this indicates a missing end tag, since the validator is unable
    // to match a starting tag with a malformed end tag. This is acceptable for now.
    describe('at the end of the end tag', function(){
      it('raises an error', function() {
        expect(function(){ validateHtml('/testHtml/basicDiv4.html')}).to.throw(Error)
      });

      it("contains line data", function() {
        var errorData = validateHtmlReturnData('/testHtml/basicDiv4.html');

        expect(errorData).to.have.property('line', 1);
        expect(errorData).to.have.property('char', 4);
        expect(errorData).to.have.property('name', "div");
      });
    });
  });

  describe('with a single nested html element with missing closing tag', function() {
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/basicDivP.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/basicDivP.html');

         expect(errorData).to.have.property('line', 1);
         expect(errorData).to.have.property('char', 7);
         expect(errorData).to.have.property('name', "p");
      });
    });
  });

  describe('with nested html elements missing a closing tag with same siblings', function() {
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/basicListItems.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/basicListItems.html');

         expect(errorData).to.have.property('line', 5);
         expect(errorData).to.have.property('char', 7);
         expect(errorData).to.have.property('name', "li");
      });
    });
  });

  describe('with strict_self_closing_tags = false options', function(){
    describe('with xhtml self closing tags', function() {
      it('does not raise an error', function() {
        expect(function(){ validateHtml('/testHtml/basicSelfClosing.html')}).to.not.throw(Error)
      });
    });

    describe('with html5 self closing tags', function() {
      it('raises an error', function() {
        expect(function(){ validateHtml('/testHtml/nonEndingSlashSelfClosing.html')}).to.not.throw(Error)
      });
    });
  });

  describe('with strict_self_closing_tags = true options', function(){
    beforeEach(function(){
      options['strict_self_closing_tags'] = true
    });

    afterEach(function(){
      options['strict_self_closing_tags'] = false
    });

    describe('with xhtml self closing tags', function() {
      it('does not raise an error', function() {
        expect(function(){ validateHtml('/testHtml/basicSelfClosing.html')}).to.not.throw(Error)
      });
    });

    describe('with html5 self closing tags', function() {
      it('raises an error', function() {
        expect(function(){ validateHtml('/testHtml/nonEndingSlashSelfClosing.html')}).to.throw(Error)
      });
    });
  });

  describe('with content nested within pre tags', function() {
    it('does not raise an error', function() {
      expect(function(){ validateHtml('/testHtml/basicPre.html')}).to.not.throw(Error)
    });
  });

  describe('with starting and closing tags not matching', function(){
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/mismatchedTags.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/mismatchedTags.html');

         expect(errorData).to.have.property('line', 2);
         expect(errorData).to.have.property('char', 5);
         expect(errorData).to.have.property('name', "h1");
      });
    });
  });

  describe('self closing script tag', function(){
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/scriptSelfClosing.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/scriptSelfClosing.html');

         expect(errorData).to.have.property('line', 2);
         expect(errorData).to.have.property('char', 7);
         expect(errorData).to.have.property('name', "script");
      });
    });
  });

  describe('pre with no closing tag', function(){
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/preMissingClosing.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/preMissingClosing.html');

         expect(errorData).to.have.property('line', 2);
         expect(errorData).to.have.property('char', 6);
         expect(errorData).to.have.property('name', "pre");
      });
    });
  });

  describe('script with no closing tag', function(){
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/scriptClosing.html')}).to.throw(Error)
    });

    describe("error data", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/scriptClosing.html');

         expect(errorData).to.have.property('line', 2);
         expect(errorData).to.have.property('char', 7);
         expect(errorData).to.have.property('name', "script");
      });
    });
  });

  describe('with html comments', function() {
    it('does not raise an error', function() {
      expect(function(){ validateHtml('/testHtml/htmlComments.html')}).to.not.throw(Error)
    });
  });

  describe('script with no closing tag', function(){
    it('raises an error', function() {
      expect(function(){ validateHtml('/testHtml/scriptClosing.html')}).to.throw(Error)
    });

    describe("with unclosed html Comments", function() {
      it("contains line data", function() {
         var errorData = validateHtmlReturnData('/testHtml/htmlCommentsUnclosed.html');

         expect(errorData).to.have.property('line', 2);
         expect(errorData).to.have.property('char', 3);
         expect(errorData).to.have.property('name', "comment");
      });
    });
  });

  describe('with doctype', function() {
    it('does not raise an error', function() {
      expect(function(){ validateHtml('/testHtml/doctype.html')}).to.not.throw(Error)
    });
  });

  describe('with anchor tags', function() {
    it('does not raise an error', function() {
      expect(function(){ validateHtml('/testHtml/anchorTags.html')}).to.not.throw(Error)
    });
  });

  describe('with div class', function() {
    it('does not raise an error with hyphened class name', function() {
      expect(function(){ validateHtml('/testHtml/basicDiv5.html')}).to.not.throw(Error)
    });
  });
});
